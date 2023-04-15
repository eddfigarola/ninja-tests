import { Selector, t } from "testcafe";

/**
 * A page object representing the device add page.
 */
export default class AddPage {
  /**
   * Creates a new instance of the `AddPage` class.
   */
  constructor() {
    /**
     * The selectors for the device add page
     * @type {Selector}
     */
    this.deviceName = Selector("#system_name");
    this.deviceType = Selector("#type");
    this.deviceCapacity = Selector("#hdd_capacity");
    this.submitButton = Selector(".submitButton");
  }

  /**
   * Fills in the device details on the form.
   * @param {string} deviceName - The name of the device.
   * @param {string} deviceTypeOption - The type of the device.
   * @param {string} deviceCapacity - The capacity of the device.
   */
  async fillDeviceDetails(deviceName, deviceTypeOption, deviceCapacity) {
    await t.typeText(this.deviceName, deviceName);
    const optionElement = this.deviceType
      .find("option")
      .withText(deviceTypeOption);
    await t.click(this.deviceType);
    await t.click(optionElement);

    await t.typeText(this.deviceCapacity, deviceCapacity);
  }

  /**
   * Clicks the submit button on the form.
   */
  async clickSubmitButton() {
    await t.click(this.submitButton);
  }
}
