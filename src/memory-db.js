const { cloneObject, isUndefinedOrNull, readTextFileAsync, writeTextFileAsync } = require('./helper');

// DO NOT PUT THE DATA FILE UNDER DIRECTORY BECAUSE DIRECTORY CREATION IS NOT HANDLED...
const DATA_FILE_PATH = './memory-db.json';

module.exports.MemoryDb = class MemoryDb {

  constructor() {
    this._lastGeneratedId = 0;
    this._data = Object.create(null);
  }

  _getNextId() {
    ++this._lastGeneratedId;

    return this._lastGeneratedId;
  }

  _getCollection(collectionName) {
    // getting the collectionm
    let collection = this._data[collectionName];

    // if the collection is found, we shall return the collection...
    if (Array.isArray(collection)) { return collection; }

    // otherwise, we shall create a new collection...
    collection = [];
    // and add that collection to the data object...
    this._data[collectionName] = collection;

    // lastly, we shall return the collection...
    return collection;
  }

  _findByAttribute({ attributeName, attributeValue, collectionName, }) {
    // getting the collection...
    const collection = this._getCollection(collectionName);
    // creating a new list to hold filtered elements...
    const filteredCollection = [];

    // iterating over all the elements of the collection...
    for (const element of collection) {
      if (isUndefinedOrNull(element) || element[attributeName] !== attributeValue) { continue; }

      // if the attribute value matches, we shall push the element to our filtered collection...
      filteredCollection.push(element);
    }

    // finally, we shall return the filtered collection...
    return filteredCollection;
  }

  _findById({ id, collectionName, }) {
    const filteredCollection = this._findByAttribute({
      attributeName: 'id',
      attributeValue: id,
      collectionName: collectionName,
    });
    const element = filteredCollection[0];

    return element;
  }

  get() {
    return {
      lastGeneratedId: this._lastGeneratedId,
      data: this._data,
    }
  }

  set({ lastGeneratedId, data, }) {
    if (isUndefinedOrNull(data)
      || isUndefinedOrNull(lastGeneratedId)) { return; }

    this._lastGeneratedId = lastGeneratedId;
    this._data = data;
  }

  findById({ id, collectionName, }) {
    const element = this._findById({ id, collectionName, });
    // we shall create a clone of the original object before
    // returning it to the caller so that our internal data
    // does not get modified...
    const clonedElement = cloneObject(element);

    return clonedElement;
  }

  findByAttribute({ attributeName, attributeValue, collectionName, }) {
    const filteredCollection = this._findByAttribute({ attributeName, attributeValue, collectionName, });
    const list = cloneObject(filteredCollection);

    return list;
  }

  findAll({ collectionName, }) {
    const collection = this._getCollection(collectionName);
    const list = cloneObject(collection);

    return list;
  }

  create({ element, collectionName, }) {
    element.id = this._getNextId();

    const clonedElement = cloneObject(element);
    const collection = this._getCollection(collectionName);
    collection.push(clonedElement);

    MemoryDb.saveDataAsync();

    // we shall return the object that is passed by the user
    // because we don't want to allow the user to manipulate
    // the internal data...
    return element;
  }

  update({ id, updatedElement, collectionName, }) {
    const collection = this._getCollection(collectionName);

    for (let i = 0; i < collection.length; ++i) {
      const previousElement = collection[i];

      if (isUndefinedOrNull(previousElement)) { continue; }

      if (previousElement.id === id) {
        updatedElement.id = id;

        collection[i] = cloneObject(updatedElement);

        MemoryDb.saveDataAsync();

        return {
          previousElement,
          updatedElement,
        };
      }
    }

    return Object.create(null);
  }

  delete({ id, collectionName, }) {
    const collection = this._getCollection(collectionName);

    for (let i = 0; i < collection.length; ++i) {
      const element = collection[i];

      if (isUndefinedOrNull(element)) { continue; }

      // if we've found the element with the ID...
      if (element.id === id) {
        // we shall assign 'undefined' to that slot...
        collection[i] = undefined;

        MemoryDb.saveDataAsync();

        return element;
      }
    }

    return undefined;
  }

  static instance = new MemoryDb();

  /**
   * @returns {MemoryDb} 
   */
  static getInstance() {
    return this.instance;
  }

  static async loadDataAsync() {
    const dataAsJson = await readTextFileAsync(DATA_FILE_PATH);

    if (!dataAsJson.length) { return; }

    let data;

    try {
      data = JSON.parse(dataAsJson);
    } catch (error) {
      console.error('An error occurred while parsing data as JSON.', error);

      return;
    }

    this.instance.set(data);

    console.log('Successfully loaded data from disk into memory.');
  }

  static async saveDataAsync() {
    let dataAsJson;

    try {
      dataAsJson = JSON.stringify(this.instance.get(), undefined, 2);
    } catch (error) {
      console.error('An error occurred while converting data to JSON.', error);

      return;
    }

    const written = await writeTextFileAsync(dataAsJson, DATA_FILE_PATH);

    written && console.log('Successfully stored data from memory into disk.');
  }
};
