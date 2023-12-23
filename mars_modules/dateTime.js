let utc = require('dayjs/plugin/utc')
let timezone = require('dayjs/plugin/timezone')
let dayofyear = require('dayjs/plugin/dayOfYear')
const dayjs = require('dayjs');
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(dayofyear)

// TODO: implement smart time format and time checker with regex
class DateTime {

  #getDayjsObject;
  #time;
  #format;
  #zoneId
  #shortTimezones = {
    UTC: 'Etc/UTC',
    GMT: 'Etc/GMT',
    EST: "EST",
    HST: "HST",
    MST: "MST",
    ACT: "Australia/Darwin",
    AET: "Australia/Sydney",
    AGT: "America/Argentina/Buenos_Aires",
    ART: "Africa/Cairo",
    AST: "America/Anchorage",
    BET: "America/Sao_Paulo",
    BST: "Asia/Dhaka",
    CAT: "Africa/Harare",
    CNT: "America/St_Johns",
    CST: "America/Chicago",
    CTT: "Asia/Shanghai",
    EAT: "Africa/Addis_Ababa",
    ECT: "Europe/Paris",
    IET: "America/Indiana/Indianapolis",
    IST: "Asia/Kolkata",
    JST: "Asia/Tokyo",
    MIT: "Pacific/Apia",
    NET: "Asia/Yerevan",
    NST: "Pacific/Auckland",
    PLT: "Asia/Karachi",
    PNT: "America/Phoenix",
    PRT: "America/Puerto_Rico",
    PST: "America/Los_Angeles",
    SST: "Pacific/Guadalcanal",
    VST: "Asia/Ho_Chi_Minh"
  }

  #getGMTOffset ( zoneId ) {
    let offset = zoneId.split('GMT')[1]
    return `Etc/GMT${offset}`
  }

  #getUTCOffset ( zoneId ) {
    let offset = zoneId.split('UTC')[1]
    return parseInt(offset)
  }

  constructor (...args) {
    // possible args are forat as a string, time as a string and zoneId as a string
    if ( args.length < 2 || args.length > 6 ) {
      console.log('bad args');
      return
    }

    if ( args.length > 3 ) {
      this.year = args[0]
      this.month = args[1]
      this.day = args[2]
      this.hour = args[3]
      this.minute = args[4]
      this.second = args[5]
      // create dayjs object
      this.#getDayjsObject = dayjs(`${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:${this.second}`)
      this.millisecond = this.#getDayjsObject.millisecond()
      this.dayOfYear = this.#getDayjsObject.dayOfYear()
      this.dayOfWeek = this.#getDayjsObject.day()
      return
    }

    // check each and create a Date object with those args
    for ( let i = 0; i < args.length; i++ ) {
      // check if arg is a time format
      if ( args[i].toLowerCase().includes('yyyy') || args[i].includes('MM') || args[i].includes('dd') || args[i].includes('HH') || args[i].includes('mm') || args[i].includes('ss') ) {
        this.#format = args[i]
      }
      // check if the args[i] is a time
      else if ( new RegExp('[0-9]').test( args[i] ) ) {
        this.#time = args[i]
      }
      // check if the args[i] is any zoneId
      else {
        if ( args[i].length === 3 ) {
          if ( args[i].includes('GMT') ) {
            this.#zoneId = this.#getGMTOffset(args[i])
          } else if ( args[i].includes('UTC') ) {
            this.#zoneId = this.#getUTCOffset(args[i])
          } else {
            this.#zoneId = this.#shortTimezones[args[i]]
          }
        }
        this.#zoneId = args[i]
      }
    }
    if ( typeof parseInt(this.#zoneId) === 'number' && !isNaN(parseInt(this.#zoneId)) ) {
      this.#getDayjsObject = dayjs.utc(this.#time, this.#format).utcOffset(this.#zoneId)
      console.log('zoneId is a number');
    } else {
      this.#getDayjsObject = dayjs.tz(this.#time, this.#format, this.#zoneId)
      console.log('zoneId is smt else');
    }
    this.year = this.#getDayjsObject.year()
    this.month = this.#getDayjsObject.month() + 1
    this.day = this.#getDayjsObject.date()
    this.hour = this.#getDayjsObject.hour()
    this.minute = this.#getDayjsObject.minute()
    this.second = this.#getDayjsObject.second()
    this.millisecond = this.#getDayjsObject.millisecond()
    this.dayOfYear = this.#getDayjsObject.dayOfYear()
    this.dayOfWeek = this.#getDayjsObject.day()
    // console.log(this.#getDayjsObject.year())
    // this.#getDayjsObject = dayjs(this.time, this.format).tz(this.zoneId)
    return
  }

  getEpochMilliseconds () {
    return this.#getDayjsObject.valueOf()
  }

  setZone ( str ) {
    if ( parseInt(str) > 16 || parseInt(str) < -16 ) return
    this.#getDayjsObject = this.#getDayjsObject.utcOffset(parseInt(str) * 60)
    return
  }

  addYears ( num ) {
    this.#getDayjsObject = this.#getDayjsObject.add(parseInt(num), 'year')
    return this
  }

  addMonths ( num ) {
    this.#getDayjsObject = this.#getDayjsObject.add(parseInt(num), 'month')
    return this
  }

  addDays ( num ) {
    this.#getDayjsObject = this.#getDayjsObject.add(parseInt(num), 'day')
    return this
  }

  addHours ( num ) {
    this.#getDayjsObject = this.#getDayjsObject.add(parseInt(num), 'hour')
    return this
  }

  addMinutes ( num ) {
    this.#getDayjsObject = this.#getDayjsObject.add(parseInt(num), 'minute')
    return this
  }

  addSeconds ( num ) {
    this.#getDayjsObject = this.#getDayjsObject.add(parseInt(num), 'second')
    return this
  }

  before ( ...dates ) {
    // check if the dates are DateTime objects
    for ( let i = 0; i < dates.length; i++ ) {
      if ( !(dates[i] instanceof DateTime) ) {
        console.log('bad args');
        return
      }
    }
    // check if the date is before the other dates
    for ( let i = 0; i < dates.length; i++ ) {
      if ( this.#getDayjsObject.isBefore(dates[i].dayjs, 'day') ) {
        return true
      }
    }
    return false
  }

  after ( ...dates ) {
    // check if the dates are DateTime objects
    for ( let i = 0; i < dates.length; i++ ) {
      if ( !(dates[i] instanceof DateTime) ) {
        console.log('bad args');
        return
      }
    }
    // check if the date is after the other dates
    for ( let i = 0; i < dates.length; i++ ) {
      if ( this.#getDayjsObject.isAfter(dates[i].dayjs, 'day') ) {
        return true
      }
    }
    return false
  }

  toString () {
    return this.#getDayjsObject.toISOString()
  }
}

module.exports = DateTime