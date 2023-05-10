import { Selector, RequestLogger } from "testcafe";
import DevicesPage from "../page-objects/DevicesPage";
import DevicesAPI from "../helpers/Api";
import { CLIENT_APP_URL, SERVER_API_URL } from "../constants";
import AddPage from "../page-objects/AddPage";

const logger = RequestLogger(
  { url: `${SERVER_API_URL}/devices`, method: "post" },
  {
    logRequestBody: true,
    logResponseBody: true,
  }
);

fixture("Device tests")
  .page(CLIENT_APP_URL)
  .requestHooks(logger)
  .beforeEach(async (t) => {
    t.ctx.devicesPage = new DevicesPage();
    t.ctx.addDevicePage = new AddPage();
    t.ctx.apiHelper = new DevicesAPI();
  });

// Test 1 - API call to retrieve the list of devices
test("List of devices is displayed correctly", async (t) => {
  const { devicesPage, apiHelper } = t.ctx;

  // Ensure devices boxes are loaded and visible
  await t
    .expect(devicesPage.getDevices().visible)
    .ok("Devices list is not loaded");

  // Get devices list from API /devices
  const devices = await apiHelper.getDevices();

  await Promise.all(
    devices.map(async (currentDeviceFromAPI) => {
      let deviceBoxElement = await devicesPage.findDevice(
        currentDeviceFromAPI["id"]
      );

      // Verify the device name, device type and device capacity match the values from API response
      await t
        .expect(deviceBoxElement.deviceNameElement.textContent)
        .eql(
          currentDeviceFromAPI["system_name"],
          `Device name is not correct for device id ${currentDeviceFromAPI["id"]}`
        );
      await t
        .expect(deviceBoxElement.deviceTypeElement.textContent)
        .eql(
          currentDeviceFromAPI["type"],
          `Device type is not correct for device id ${currentDeviceFromAPI["id"]}`
        );
      await t
        .expect(deviceBoxElement.deviceCapacityValue)
        .eql(
          currentDeviceFromAPI["hdd_capacity"],
          `Device capacity is not correct for device id ${currentDeviceFromAPI["id"]}`
        );

      // Verify the buttons Edit and Remove are displayed
      await t
        .expect(deviceBoxElement.deviceNameElement.visible)
        .ok(
          `Device name is not displayed for device id ${currentDeviceFromAPI["id"]}`
        );
      await t
        .expect(deviceBoxElement.deviceTypeElement.visible)
        .ok(
          `Device type is not displayed for device id ${currentDeviceFromAPI["id"]}`
        );
      await t
        .expect(deviceBoxElement.deviceCapacityElement.visible)
        .ok(
          `Device capacity is not displayed for device id ${currentDeviceFromAPI["id"]}`
        );
      await t
        .expect(deviceBoxElement.deviceEditButton.visible)
        .ok(
          `Edit button is not displayed for device id ${currentDeviceFromAPI["id"]}`
        );
      await t
        .expect(deviceBoxElement.deviceRemoveButton.visible)
        .ok(
          `Remove button is not displayed for device id ${currentDeviceFromAPI["id"]}`
        );
    })
  );
});

// Test 2 - Verify devices can be created properly using the UI
test("New device is created successfully", async (t) => {
  const { devicesPage, addDevicePage } = t.ctx;

  // Add new device
  const deviceName = "New Device";
  const deviceType = "MAC";
  const deviceCapacity = "100";

  await devicesPage.clickAddDeviceButton();
  await addDevicePage.fillDeviceDetails(deviceName, deviceType, deviceCapacity);
  await addDevicePage.clickSubmitButton();

  // Wait for the API to respond with the added device by checking the count of logged POST requests
  await t.expect(logger.count(() => true)).eql(1);
  const actualStatusCode = logger.requests[0].response.statusCode;

  // Assert the response status code is within the success range (200-299)
  await t
    .expect(actualStatusCode)
    .within(
      200,
      299,
      `Expected response status code from API to be in the success range (200-299), but received ${actualStatusCode}.`
    );
  const responseBody = logger.requests[0].response.body.toString("utf8");

  // Obtain the id for the device added.
  const responseJSON = JSON.parse(responseBody);
  const id = responseJSON.id;

  // Verify that the device is added successfully to the DOM by finding the corresponding device row
  const deviceRow = await devicesPage.findDevice(id);

  // Verify that the added device displays device name, device type, device capacity, edit, and remove buttons
  await t
    .expect(deviceRow.deviceNameElement.visible)
    .ok(`Device name is not displayed for the device added with id ${id}`);
  await t
    .expect(deviceRow.deviceTypeElement.visible)
    .ok(`Device type is not displayed for the device added with id ${id}`);
  await t
    .expect(deviceRow.deviceCapacityElement.visible)
    .ok(`Device capacity is not displayed for the device added with id ${id}`);
  await t
    .expect(deviceRow.deviceEditButton.visible)
    .ok(`Edit button is not displayed for the device added with id ${id}`);
  await t
    .expect(deviceRow.deviceRemoveButton.visible)
    .ok(`Remove button is not displayed for the device added with id ${id}`);

  // Verify that the device name, device type, and device capacity display the correct text
  await t
    .expect(deviceRow.deviceNameElement.textContent)
    .eql(
      deviceName,
      `Device name is not correct for the device added with id ${id}`
    );
  await t
    .expect(deviceRow.deviceTypeElement.textContent)
    .eql(
      deviceType,
      `Device type is not correct for the device added with id ${id}`
    );
  await t
    .expect(deviceRow.deviceCapacityText)
    .eql(
      `${deviceCapacity} GB`,
      `Device capacity text is not correct for the device added with id ${id}`
    );
});

// Test 3 - API call to rename the first device in the list
test("Rename the first device in the list", async (t) => {
  const { devicesPage, apiHelper } = t.ctx;

  // Find the first device in the list
  const firstDevice = await devicesPage.findDevice(0);

  // Define the new name for the device
  const newName = "Rename Device";

  // Call the API to rename the device
  await apiHelper.editDeviceDetails(
    firstDevice.deviceId,
    newName,
    firstDevice.deviceType,
    firstDevice.deviceCapacityValue
  );

  // Refresh the page and find the renamed device
  await t.eval(() => location.reload(true));

  // Find the device and verify that the device has been renamed successfully
  const renamedDevice = await devicesPage.findDevice(0);

  // Verify that the renamed device displays device name, device type, device capacity, edit, and remove buttons after editing the name
  await t
    .expect(renamedDevice.deviceNameElement.visible)
    .ok(
      `Device name is not displayed for the device with ID ${firstDevice.deviceId} after renaming.`
    );
  await t
    .expect(renamedDevice.deviceTypeElement.visible)
    .ok(
      `Device type is not displayed for the device with ID ${firstDevice.deviceId} after renaming.`
    );
  await t
    .expect(renamedDevice.deviceCapacityElement.visible)
    .ok(
      `Device capacity is not displayed for the device with ID ${firstDevice.deviceId} after renaming.`
    );
  await t
    .expect(renamedDevice.deviceEditButton.visible)
    .ok(
      `Edit button is not displayed for the device with ID ${firstDevice.deviceId} after renaming.`
    );
  await t
    .expect(renamedDevice.deviceRemoveButton.visible)
    .ok(
      `Remove button is not displayed for the device with ID ${firstDevice.deviceId} after renaming.`
    );

  // Verify that the renamed device have the correct new name.
  await t
    .expect(renamedDevice.deviceNameElement.textContent)
    .eql(
      newName,
      `Device name is not renamed correctly for the device with ID ${firstDevice.deviceId}`
    );
});

// Test 4 - API call to delete the last device in the list
test("Last device is deleted successfully", async (t) => {
  const { devicesPage, apiHelper } = t.ctx;

  // Get initial device count
  const initialCount = await Selector(".device-main-box").count;

  const deviceMainBoxes = Selector(".device-main-box");
  await t
    .expect(deviceMainBoxes.visible)
    .ok("Device main boxes are not visible");

  // Find the last device
  const lastDevice = await devicesPage.findDevice(initialCount - 1);
  const deviceId = await lastDevice.deviceId;

  // Call the API to delete the device
  await apiHelper.deleteDevice(deviceId);

  // Refresh the page and verify the element is no longer visible and doesn't exist in the DOM

  await t.eval(() => location.reload(true));
  await t
    .expect(deviceMainBoxes.visible)
    .ok("Device main boxes are not visible after reload");

  const lastDeviceNow = await devicesPage.findDevice(deviceId);
  await t
    .expect(await lastDeviceNow.visible)
    .notOk(`Last device with id ${deviceId} is still visible`);
});
