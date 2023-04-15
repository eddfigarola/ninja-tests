import { t } from "testcafe";
import {SERVER_API_URL } from "../constants";
/**
 * A class that provides methods for interacting with a device API.
 */
export default class DevicesAPI {
  /**
   * Creates a new instance of the DevicesAPI class.
   */
  constructor() {
    /**
     * The base URL of the device API.
     * @type {string}
     */
    this.url = SERVER_API_URL;
  }

  /**
   * Retrieves a list of devices from the API.
   * @returns {Promise<Object[]>} A promise that resolves to an array of device objects.
   */
  async getDevices() {
    return await t.request({
      url: `${this.url}/devices/`,
      method: "GET",
    });
  }

  /**
   * Updates the details of a device with the specified ID.
   * @param {number} id - The ID of the device to update.
   * @param {string} newName - The new name for the device.
   * @param {string} type - The type of the device.
   * @param {string} capacity - The capacity of the device.
   * @returns {Promise<Object>} A promise that resolves to the updated device object.
   */
  async editDeviceDetails(id, newName, type, capacity) {
    return await t.request({
      url: `${this.url}/devices/${id}`,
      method: "put",
      body: {
        id: `${id}`,
        system_name: newName,
        type: type,
        hdd_capacity: capacity,
      },
    });
  }

  /**
   * Deletes a device with the specified ID.
   * @param {number} id - The ID of the device to delete.
   * @returns {Promise<Object>} A promise that resolves to the deleted device object.
   */
  async deleteDevice(id) {
    return await t.request({
      url: `${this.url}/devices/${id}`,
      method: "delete",
    });
  }
}
