import axios from "axios";
import { SERVER_API_URL } from "../constants";

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
   * Handles errors from API requests.
   * @param {string} operation - The name of the operation (e.g., "retrieve devices").
   * @param {Error} error - The error object thrown during the operation.
   */
  handleError(operation, error) {
    console.error(`Error during ${operation}:`, error);
    throw error; // Rethrow the error to propagate it to the caller
  }

  /**
   * Asserts the success response code.
   * @param {number} statusCode - The status code to check.
   * @param {string} operation - The name of the operation (e.g., "retrieve devices").
   */
  assertSuccessResponse(statusCode, operation) {
    if (statusCode >= 200 && statusCode < 300) {
      return;
    }

    const error = new Error(
      `Failed to ${operation}. Received response code ${statusCode}`
    );
    error.statusCode = statusCode;
    throw error;
  }

  /**
   * Retrieves a list of devices from the API.
   * @returns {Promise<Object[]>} A promise that resolves to an array of device objects.
   */
  async getDevices() {
    try {
      const response = await axios.get(`${this.url}/devices/`);
      this.assertSuccessResponse(response.status, "retrieve devices");
      return response.data;
    } catch (error) {
      this.handleError("retrieve devices", error);
    }
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
    try {
      const response = await axios.put(`${this.url}/devices/${id}`, {
        id: `${id}`,
        system_name: newName,
        type: type,
        hdd_capacity: capacity,
      });
      this.assertSuccessResponse(response.status, `edit device with ID ${id}`);
      return response.data;
    } catch (error) {
      this.handleError(`edit device with ID ${id}`, error);
    }
  }

  /**
   * Deletes a device with the specified ID.
   * @param {number} id - The ID of the device to delete.
   * @returns {Promise<Object>} A promise that resolves to the deleted device object.
   */
  async deleteDevice(id) {
    try {
      const response = await axios.delete(`${this.url}/devices/${id}`);
      this.assertSuccessResponse(
        response.status,
        `delete device with ID ${id}`
      );
      return response.data;
    } catch (error) {
      this.handleError(`delete device with ID ${id}`, error);
    }
  }
}
