const { MongoClient } = require("mongodb")
const apiResponse = require("../helpers/apiResponse")
const apiExternal = require("../apiExternal/apiExternal")
const apiURL = require("../apiExternal/apiURL")
const apiCall = require("../apiExternal/apiCall")
const uri = `mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.CLUSTER_URL}/?authMechanism=${process.env.AUTH_MECHANISM}`
const client = new MongoClient(uri, {
    useUnifiedTopology: true,
    //   useNewUrlParser: true,
    //   useMongoClient: true
})

exports.test = async function (req, res) {
    apiResponse.successResponse(res, "Test Success.", await apiCall.axios(apiURL.testURL(req.body)))
}

exports.trendingList = async function (req, res) {
    try {
        apiResponse.successResponse(
            res,
            "Success.",
            await apiCall.axios(apiURL.trendingURL(req.body))
        )
    } catch (error) {
        apiResponse.ErrorResponse(res, error)
    }
}

exports.searchList = async function (req, res) {
    try {
        apiResponse.successResponse(
            res,
            "Success.",
            await apiCall.axios(apiURL.searchURL(req.body))
        )
    } catch (error) {
        apiResponse.ErrorResponse(res, error)
    }
}

exports.filterList = async function (req, res) {
    try {
        apiResponse.successResponse(
            res,
            "Success.",
            await apiCall.axios(apiURL.filterURL(req.body))
        )
    } catch (error) {
        apiResponse.ErrorResponse(res, error)
    }
}

exports.upcomingList = async function (req, res) {
    try {
        apiResponse.successResponse(
            res,
            "Success.",
            await apiCall.axios(apiURL.upcomingURL(req.body))
        )
    } catch (error) {
        apiResponse.ErrorResponse(res, error)
    }
}

exports.getRecommends = async function (req, res) {
    try {
        apiResponse.successResponse(
            res,
            "Success.",
            await apiCall.axios(apiURL.recommendationsURL(req.body))
        )
    } catch (error) {
        apiResponse.ErrorResponse(res, error)
    }
}

exports.getSeasons = async function (req, res) {
    try {
        apiResponse.successResponse(
            res,
            "Success.",
            await apiCall.axios(apiURL.seasonsURL(req.body))
        )
    } catch (error) {
        apiResponse.ErrorResponse(res, error)
    }
}

exports.getVideos = async function (req, res) {
    // try {
    await client.connect()
    let db = client.db("bingefeast")

    let mediaAvailable = await db.collection("media").findOne({ id: req.body.id })

    if (mediaAvailable === null) {
        let newMedia = { ...req.body, ...await apiCall.axios(apiURL.videosURL(req.body)) }
        let db_videos = await db.collection("media").insertOne(newMedia)
        console.log(`Doc created in details_movie/tv id: ${db_videos.insertedId}`)
        await apiResponse.successResponse(res, "Doc Creation Successful.", newMedia)
    } else {
        await apiResponse.successResponse(res, "Doc Selection Successful.", mediaAvailable)
    }
}



exports.getOTTStreams = async function (req, res) {
    // try {
    await client.connect()
    let db = client.db("bingefeast")

    let dataFromDB = await db.collection("ott_streams").findOne({ id: req.body.id })

    if (dataFromDB === null) {
        let platforms = await apiExternal.ottStreams(req.body)
        let dbCount = await db.collection("counters")
            .updateOne({ counterName: "utelly" }, { $inc: { counts: +1 } })
        console.log(`docs matched QRY:${dbCount.matchedCount}, doc updated:${dbCount.modifiedCount}`)

        let newData = { ...req.body, platforms }
        let db_videos = await db.collection("ott_streams").insertOne(newData)
        console.log(`Doc created in ott_streams, id: ${db_videos.insertedId}`)

        await apiResponse.successResponse(res, "Doc Creation Successful.", newData)
    } else {
        await apiResponse.successResponse(res, "Doc Selection Successful.", dataFromDB)
    }
}

exports.getCastDetails = async function (req, res) {
    await client.connect()
    let db = client.db("bingefeast")

    let dataFromDB = await db.collection("details_cast").findOne({ id: req.body.id })

    if (dataFromDB === null) {
        let externalIDs = await apiCall.axios(apiURL.externalIDURL(req.body))
        let z = { ...req.body, imdb_id: externalIDs.imdb_id }
        let newData = { ...req.body, ...await apiExternal.castDetails(z) }
        let db_cast = await db.collection("details_cast").insertOne(newData)
        console.log(`Doc created in details_cast, id: ${db_cast.insertedId}`)
        await apiResponse.successResponse(res, "Doc Creation Successful.", newData)
    } else {
        await apiResponse.successResponse(res, "Doc Selection Successful.", dataFromDB)
    }
}

exports.getDetails = async function (req, res) {
    console.log("getDetails Params:", req.body)

    await client.connect()
    let db = client.db("bingefeast")

    let collectionSelect =
        req.body.media_type === "movie"
            ? "details_movie"
            : req.body.media_type === "tv"
                ? "details_tv"
                : null

    let dbSearch = await db.collection(collectionSelect).findOne({ id: req.body.id })

    if (dbSearch === null) {
        let combinedResult = null
        let details = await apiCall.axios(apiURL.detailsURL(req.body))
        let externalID = await apiCall.axios(apiURL.externalIDURL(req.body))
        combinedResult = {
            media_type: req.body.media_type,
            ...details, ...externalID
        }
        let dbResDetail = await db.collection(collectionSelect).insertOne(combinedResult)
        console.log(`Doc created in details_movie/tv id: ${dbResDetail.insertedId}`)

        await apiResponse.successResponse(res, "Doc Creation Successful.", combinedResult)
    } else {
        await apiResponse.successResponse(res, "Doc Selection Successful.", dbSearch)
    }
}


/**
 * userInfo API
 */

exports.getInfo = async function (req, res) {
    await client.connect()
    let db = client.db("bingefeast")
    let feedbackData = { ...req.body }

    let db_videos = await db.collection("user_info").insertOne(req.body)
    let ipStackCounter = await db.collection("counters")
        .updateOne({ counterName: "ipStack" }, { $inc: { counts: +1 } })

    console.log(`Doc created\n 
    feedbacks id: ${db_videos.insertedId}
    \nipStack:${ipStackCounter.insertedId}`)


    await apiResponse.successResponse(res, "Doc Creation Successful.", feedbackData)
}

exports.getFeedback = async function (req, res) {
    await client.connect()
    let db = client.db("bingefeast")
    let db_insert = await db.collection("feedbacks").insertOne(req.body)
    console.log(`Doc created feedbacks id: ${db_insert.insertedId}`)

    await apiResponse.successResponse(res, "Doc Creation Successful.", req.body)
}
