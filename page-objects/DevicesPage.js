import { Selector, t } from "testcafe";

/**
 * Custom error class for device page errors.
 */
class DevicesPageError extends Error {
  constructor(message) {
    super(message);
    this.name = "DevicesPageError";
  }
}

/**
 * A page object representing the devices list page.
 */

export default class DevicesPage {
  constructor() {
    /**
     * @type {Selector}
     */
    this.deviceBoxElement = Selector(".device-main-box");
    this.addDeviceButton = Selector(".submitButton");
    this.deviceEditClass = ".device-edit";
    this.deviceMainBoxClass = ".device-main-box";
    this.deviceNameClass = ".device-name";
    this.deviceTypeClass = ".device-type";
    this.deviceCapacityClass = ".device-capacity";
    this.deviceRemoveClass = ".device-remove";
  }

  /**
   * Returns the devices list.
   *
   * @function
   * @returns {Selector} The devices list.
   */
  getDevices() {
    try {
      return this.deviceBoxElement;
    } catch (error) {
      throw new DevicesPageError(
        `Error retrieving device box elements: ${error}`
      );
    }
  }

  /**
   * Clicks the "Add Device" button.
   *
   * @async
   * @function
   */
  async clickAddDeviceButton() {
    try {
      await t.click(this.addDeviceButton);
    } catch (error) {
      throw new DevicesPageError(`Error clicking add device button: ${error}`);
    }
  }

  /**

  Extracts the device ID from the device edit button link.
  @async
  @function getDeviceId
  @param {Object} deviceBoxElement - The device box element from which to extract the ID.
  @returns {string} The device ID extracted from the device edit button link.
  */
  async getDeviceId(deviceBoxElement) {
    try {
      const deviceEditButton = await deviceBoxElement.find(
        this.deviceEditClass
      );
      const deviceEditButtonLink = await deviceEditButton.getAttribute("href");
      const deviceEditButtonLinkParts = deviceEditButtonLink.split("/");
      const deviceId =
        deviceEditButtonLinkParts[deviceEditButtonLinkParts.length - 1];

      return deviceId;
    } catch (error) {
      throw new DevicesPageError(`Error extracting device ID: ${error}`);
    }
  }

  /**
   * Returns a custom device object with its properties.
   *
   * @async
   * @function
   * @param {number|string} deviceIdentifier - The index or id of the device in the devices list.
   * @returns {Promise<{device: Selector, deviceName: string, deviceType: string, deviceCapacityText: string, deviceCapacityValue: string, deviceEditButton: Selector, deviceRemoveButton: Selector}>} A Promise that resolves to a custom device object.
   */
  async findDevice(deviceIdentifier) {
    try {
      let deviceBoxElement;

      /* Finds the device box element in the device list based on the given device identifier. 
    // The identifier can be either a string, representing the device's edit button href attribute, 
        or a number, representing the index of the device element in the list.
    */
      if (typeof deviceIdentifier === "string") {
        const deviceEditButtonLink = Selector(
          `${this.deviceEditClass}[href$="${deviceIdentifier}"]`
        );

        if (!(await deviceEditButtonLink.exists)) {
          return deviceEditButtonLink;
        }

        deviceBoxElement = await deviceEditButtonLink.parent(
          this.deviceMainBoxClass
        );
      } else if (typeof deviceIdentifier === "number") {
        deviceBoxElement = await this.deviceBoxElement.nth(deviceIdentifier);
      } else {
        throw new DevicesPageError(
          `Invalid device identifier:: ${deviceIdentifier}`
        );
      }

      /* Return custom object with the device box element and complement with additional attributes to easily access
       the information about deviceName, deviceType, deviceCapacityText, deviceCapacityTextValue.
    */
      return {
        deviceRow: deviceBoxElement,
        deviceNameElement: await deviceBoxElement.find(this.deviceNameClass),
        deviceName: await deviceBoxElement.find(this.deviceNameClass)
          .textContent,
        deviceType: await deviceBoxElement.find(this.deviceTypeClass)
          .textContent,
        deviceTypeElement: await deviceBoxElement.find(this.deviceTypeClass),
        deviceCapacityElement: await deviceBoxElement.find(
          this.deviceCapacityClass
        ),
        deviceCapacityText: await deviceBoxElement.find(
          this.deviceCapacityClass
        ).textContent,
        deviceCapacityValue: await (
          await deviceBoxElement.find(this.deviceCapacityClass).textContent
        ).replace(/GB|\s/g, ""),
        deviceEditButton: await deviceBoxElement.find(this.deviceEditClass),
        deviceRemoveButton: await deviceBoxElement.find(this.deviceRemoveClass),
        deviceId: await this.getDeviceId(deviceBoxElement),
      };
    } catch (error) {
      throw new DevicesPageError(
        `Error finding device with identifier: ${deviceIdentifier}`
      );
    }
  }
}
