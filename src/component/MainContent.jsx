// import React from "react";

import { Divider, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Prayer from "./Prayer";
import { useState, useEffect } from "react";
import moment from "moment/moment";
import "moment/locale/ar-dz"; // Import the Arabic locale
moment.locale("ar");

// ===================
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
// ===================

export default function MainContent() {
  //=== UseState ===

  const [todo, settodo] = useState("");

  const [timings, setTimings] = useState({
    Fajr: "04:20",
    Dhuhr: "11:50",
    Asr: "15:18",
    Maghrib: "18:03",
    Isha: "19:33",
  });

  const [seletctedCity, setSelectedCity] = useState({
    displayName: "سطات",
    apiName: "settat",
  });

  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

  const [remainingTime, setRemainingTime] = useState("");

  //=== UseState === //

  // === VARIANLES ===
  const availableCity = [
    { displayName: "سطات", apiName: "settat", id: "1" },
    { displayName: "الدار البيضاء", apiName: "casablanca", id: "2" },
    { displayName: "طنجة", apiName: "tanger", id: "3" },
  ];

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  // === VARIANLES === //

  // === API ===

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=MA&city=${seletctedCity.apiName}`
    );
    console.log(response.data.data.timings);
    setTimings(response.data.data.timings);
  };

  // === API === //

  // === USEEFFECT ===

  useEffect(() => {
    getTimings();
  }, [seletctedCity]);

  useEffect(() => {
    const t = moment();
    settodo(t.format("MMM Do YYYY | h:m"));

    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();
    // console.log(momentNow);

    // const Asr = timings["Asr"];

    // const AsrMoment = moment(Asr, "hh:mm");
    // console.log(Asr);

    // console.log(momentNow.isAfter(AsrMoment));

    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      console.log(fajrToMidnightDiff);

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }
    console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
    console.log(
      "duration issss ",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );
  };

  // === USEEFFECT ===

  // === API === //

  // /=============================
  const handleCityChange = (e) => {
    const cityObjet = availableCity.find((city) => {
      return city.apiName == e.target.value;
    });

    setSelectedCity(cityObjet);
    console.log(cityObjet);
  };

  return (
    <>
      {/* === TOP-ROW === */}
      <Grid container>
        <Grid xs={6}>
          <h2>{todo}</h2>
          <h1>{seletctedCity.displayName}</h1>
        </Grid>

        <Grid xs={6}>
          <h2> متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
          <h1>{remainingTime}</h1>
        </Grid>
      </Grid>
      {/* === TOP-ROW === */}
      <Divider style={{ borderColor: "#000", opacity: "0.5" }} />

      {/* === PRAYERS-CAARDS === */}
      <Stack
        direction={"row"}
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
      >
        <Prayer
          name={"الفجر"}
          time={timings.Fajr}
          image={"/src/component/images/Mosque, Indonesia.jpg"}
        />
        <Prayer
          name={"الظهر"}
          time={timings.Dhuhr}
          image={"/src/component/images/Mosque-Malysa.jpg"}
        />
        <Prayer
          name={"العصر"}
          time={timings.Asr}
          image={"/src/component/images/المسجد الأقصي.jpg"}
        />
        <Prayer
          name={"المغرب"}
          time={timings.Maghrib}
          image={"/src/component/images/مسجد الرسول عليه صلاة و سلام.jpg"}
        />
        <Prayer
          name={"العشاء"}
          time={timings.Isha}
          image={"/src/component/images/مكة المكرمة.jpg"}
        />
      </Stack>
      {/* === PRAYERS-CAARDS === */}

      {/*=== SELECT-CITY === */}
      <Stack
        direction={"row"}
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }} sx={{}}>
          <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleCityChange}
          >
            {availableCity.map((city) => {
              return (
                <MenuItem key={city.id} value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      {/*=== SELECT-CITY === */}
    </>
  );
}
