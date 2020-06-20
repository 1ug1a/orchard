const _ = require("lodash");
const vitals = require("@auburnsummer/vitals");

const client = require("./client.js");

const log = require("../utils/log.js");
const utils = require("../utils/promises.js");

/**
 * Given an iid from a driver, return the level commands associated with that driver.
 * @param {*} driver
 * @param {*} iid
 */
const runDriverLevel = async (driver, iid) => {
	try {
		log(":driver", `Processing ${driver.serialise()} iid ${iid}...`);
		// if it's rehosting, we need to pass "all" to vitals. otherwise "nouploading".
		const profile = driver.rehost ? "all" : "noupload";

		const rdzip = await driver.get(iid);
		const [vitalsData, driverData] = await Promise.all([vitals.analyse(rdzip, profile), driver.expand(iid)]);
		// if rehost, it's ipfs:// + the hash, otherwise it's the driver-specific URL
		const downloadURL = driver.rehost ? "ipfs://" + vitalsData.rdzip_ipfs : _.get(driverData, driver.urlPath);
		log(":driver", `Uploading ${driver.serialise()} iid ${iid}...`);
		await client.addLevel(vitalsData, downloadURL, driver.serialise(), iid, driverData);
		return Promise.resolve(true);
	} catch(err) {
		log("!driver", `Error occured when processing ${driver.serialise()} iid ${iid}`);
		log("!driver", err);
		return Promise.resolve(false);
	}
};

/**
 * Given a driver name and associated arguments, do that driver
 * @param {*} driverName
 * @param {*} args
 */
const runDriver = async (driverName, args) => {
	const Driver = require(`./drivers/${driverName}`);

	const driver = new Driver(args);

	let data;
	try {
		await driver.init();

		log(":driver", `Initialised driver ${driver.serialise()}`);

		// Get the iids...
		const iids = await driver.getIids();

		// get the vitals data and the driver-specific data
		data = await utils.mapSeries(iids, iid => runDriverLevel(driver, iid), 2);
	}
	catch (err) {
		log("!driver", err);
	}
	finally {
		try {
			await driver.cleanup();
		}
		catch (err) {
			log("!driver cleanup", err);
		}
	}

	return data;
};












module.exports = {
	runDriver: runDriver
};