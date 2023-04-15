import { Selector, RequestLogger } from "testcafe";
import DevicesPage from "../page-objects/DevicesPage";
import DevicesAPI from "../helpers/Api";
import { DEFAULT_WAIT_TIME, CLIENT_APP_URL, SERVER_API_URL } from "../constants";
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

  // Ensure devices boxes are loaded
  await t
    .wait(DEFAULT_WAIT_TIME)
    .expect(devicesPage.getDevices().exists)
    .ok("Devices list is not loaded");

  // Get devices list from API /devices
  const devices = await apiHelper.getDevices();

  await Promise.all(
    devices.body.map(async (item, index) => {
      let device = await devicesPage.findDevice(index);

      // Verify the device name, device type and device capacity match the values from API response
      await t
        .expect(device.deviceName)
        .eql(item["system_name"], "Device name is not correct");
      await t
        .expect(device.deviceType)
        .eql(item["type"], "Device type is not correct");
      await t
        .expect(device.deviceCapacityValue)
        .eql(item["hdd_capacity"], "Device capcity is not correct");

      // Verify the buttons Edit and Remove are displayed
      await t
        .expect(device.deviceEditButton.exists)
        .ok("Edit button is not displayed");
      await t
        .expect(device.deviceRemoveButton.exists)
        .ok("Remove button is not displayed");
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

  // Wait for the device to be added
  await t.expect(logger.count(() => true)).eql(1);

  const responseBody = logger.requests[0].response.body.toString("utf8");
  const responseJSON = JSON.parse(responseBody);
  const id = responseJSON.id;

  // Verify device was added successfully
  const deviceRow = await devicesPage.findDevice(id);

  await t.expect(deviceRow.deviceName).eql(deviceName);
  await t.expect(deviceRow.deviceType).eql(deviceType);
  await t.expect(deviceRow.deviceCapacityText).eql(`${deviceCapacity} GB`);
});

// Test 3 - API call to rename the first device in the list
test("Rename the first device in the list", async (t) => {
  const { devicesPage, apiHelper } = t.ctx;

  // Find the first device in the list
  const firstDevice = await devicesPage.findDevice(0);

  // Define the new name for the device
  const newName = "Rename Device"

  // Call the API to rename the device
  await apiHelper.editDeviceDetails(
    firstDevice.deviceId,
    newName,
    firstDevice.deviceType,
    firstDevice.deviceCapacityValue
  );

  // Refresh the page and find the renamed device
  await t.navigateTo("/");
  await t.eval(() => location.reload(true));
  

  // Find the device and verify that the device has been renamed successfully
  const renamedDevice = await devicesPage.findDevice(0);
  await t.expect(renamedDevice.deviceName).eql(newName);
});

// Test 4 - API call to delete the last device in the list
test("Last device is deleted successfully", async (t) => {
    const { devicesPage, apiHelper } = t.ctx;

  // Get initial device count
  const initialCount = await Selector(".device-main-box").count;

  const deviceMainBoxes = Selector(".device-main-box");
  await t.wait(DEFAULT_WAIT_TIME).expect(deviceMainBoxes.exists).ok();
  
  // Find the last device
  const lastDevice = await devicesPage.findDevice(initialCount-1);
  const deviceId = await lastDevice.deviceId;

  // Call the API to delete the device
  apiHelper.deleteDevice(deviceId)

  // Refresh the page and verify the element is no longer visible and doesn't exist in the DOM

  await t.navigateTo("/");
  await t.eval(() => location.reload(true));
  await t.wait(DEFAULT_WAIT_TIME).expect(deviceMainBoxes.exists).ok();

  const lastDeviceNow = await devicesPage.findDevice(deviceId);
  await t.expect(await lastDeviceNow.exists).notOk()

  
});
