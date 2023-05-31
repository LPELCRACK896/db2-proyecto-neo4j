const neo4j = require('neo4j-driver');

const toBigInt = (neo4jInt) => {
    return neo4jInt.toString();
}

const toDate = (yearLow, monthLow, dayLow) => {
    return new Date(yearLow, monthLow - 1, dayLow); // Months are 0-indexed in JS Date
}

const convertNeo4jProps = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(convertNeo4jProps);
    } else if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => {
                if (neo4j.isInt(value)) {
                    return [key, toBigInt(value)];
                } else if (value.year && value.month && value.day) {
                    return [key, toDate(value.year.low, value.month.low, value.day.low)];
                } else {
                    return [key, convertNeo4jProps(value)];
                }
            })
        );
    } else {
        return obj;
    }
}

module.exports = {toBigInt, toDate, convertNeo4jProps}
