import { useGardens } from "./hooks/useGardens";
import styles from "./app.module.css";
import { useState } from "react";

// Original English days
const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];

// Map English day names to Hebrew
const daysHebrew = {
  sunday: "ראשון",
  monday: "שני",
  tuesday: "שלישי",
  wednesday: "רביעי",
  thursday: "חמישי",
};

function App() {
  const gardens = useGardens();
  const [selectedDay, setSelectedDay] = useState("");

  const visibleGardens = selectedDay
    ? gardens.filter((g) => g.day === selectedDay)
    : gardens;

    function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // get last 2 digits
  return `${day}/${month}/${year}`;
}


  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", direction: "rtl" }} className={styles.appContainer}>
      <h1>ניהול גנים</h1>

      {gardens.length === 0 && <p>אין גנים עדיין.</p>}

      <div className={styles.control}>
        <div className={styles.dayBar}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={
              selectedDay === day
                ? `${styles.dayButton} ${styles.active}`
                : styles.dayButton
            }
          >
            {daysHebrew[day]}
          </button>
        ))}

        <button
          onClick={() => setSelectedDay("")}
          className={
            selectedDay === ""
              ? `${styles.dayButton} ${styles.active}`
              : styles.dayButton
          }
        >
          הכל
        </button>
        
      </div>
      <button
  className={styles.dayButton}
  onClick={() => (window.location.href = "/new-garden")}
>
  ➕ הוסף גן חדש
</button>
      </div>

      <ul className={styles.list}>
        {visibleGardens.map((g) => (
          <li
            key={g.id}
            className={styles.card}
            onClick={() => (window.location.href = `/garden/${g.id}`)}
          >
            <div className={styles.info}>
              <div className={styles.title}>{g.name}</div>
              <div className={styles.address}>{g.address}</div>

              <div className={styles.lastVisit}>
  ביקור אחרון: <strong>{g.lastVisit ? formatDate(g.lastVisit) : "אין ביקורים עדיין"}</strong>
</div>


              <button
                className={styles.button}
                onClick={(e) => {
                  e.stopPropagation();
                  alert("ניווט בקרוב!");
                }}
              >
                ניווט
              </button>
            </div>

            <div className={styles.imageWrapper}>
              <img src="/assets/1.jpg" className={styles.image} alt={g.name} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
