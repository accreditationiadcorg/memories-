const events = [
  "01-اول مغامرة",
  "02-رسالة",
  "03-عيد ميلاد مودي",
  "04-عيد ميلاد مريومة",
  "05-خروفنا الصغير",
  "06-مريومة في المطبخ",
  "07-الملاهي",
  "08-سلسلة",
  "09-بابا مودي وماما مريومة"
];

const box = document.getElementById("events");
const modal = document.getElementById("modal");

document.getElementById("count").textContent =
  events.length + " أحداث";

const title = (folder) =>
  folder.replace(/^\d+-/, "").replaceAll("-", " ");


/* البحث عن صور الحدث */
function test(folder, n, done) {

  const num = String(n).padStart(2, "0");

  const extensions = [
    "jpg",
    "jpeg",
    "png",
    "webp"
  ];

  let i = 0;

  function go() {

    if (i >= extensions.length) {
      done(null);
      return;
    }

    const src =
      `events/${folder}/${num}.${extensions[i++]}`;

    const img = new Image();

    img.onload = () => {
      done(src);
    };

    img.onerror = () => {
      go();
    };

    img.src = src;
  }

  go();
}


/* الحصول على صور الحدث */
function getPhotos(folder, done) {

  const photos = [];
  let n = 1;

  function next() {

    if (n > 50) {
      done(photos);
      return;
    }

    test(folder, n, (src) => {

      if (!src) {
        done(photos);
        return;
      }

      photos.push(src);

      n++;

      next();
    });
  }

  next();
}


/* إنشاء الأحداث */
events.forEach((folder, i) => {

  const name = title(folder);

  const card = document.createElement("article");

  card.className = "event";

  card.innerHTML = `
    <div class="cover">

      <img
        src="events/${folder}/cover.jpg"
        alt="${name}"
        onerror="
          this.onerror=null;
          this.src='events/${folder}/01.jpg';
        "
      >

      <div class="shade"></div>

    </div>

    <div class="info">

      <span class="badge">
        فتح الألبوم
      </span>

      <h3>${name}</h3>

      <p>
        اضغط لمشاهدة الذكريات
      </p>

    </div>
  `;

  card.onclick = () => open(i);

  box.appendChild(card);

});


/* فتح الحدث */
function open(i) {

  const folder = events[i];
  const name = title(folder);

  document.getElementById("title").textContent = name;

  document.getElementById("num").textContent =
    "جارٍ تحميل الصور...";

  document.getElementById("gallery").innerHTML = "";

  modal.classList.add("open");

  document.body.style.overflow = "hidden";


  getPhotos(folder, (photos) => {

    document.getElementById("num").textContent =
      photos.length + " صور";


    if (photos.length === 0) {

      document.getElementById("gallery").innerHTML = `
        <div class="empty">
          لا توجد صور داخل هذا الحدث
        </div>
      `;

      return;
    }


    document.getElementById("gallery").innerHTML =
      photos
        .map(photo => `
          <img
            src="${photo}"
            loading="lazy"
          >
        `)
        .join("");

  });
}


/* إغلاق الحدث */
function closeModal() {

  modal.classList.remove("open");

  document.body.style.overflow = "";
}


document.getElementById("close").onclick = closeModal;


modal.onclick = (e) => {

  if (e.target === modal) {
    closeModal();
  }

};


document.onkeydown = (e) => {

  if (e.key === "Escape") {
    closeModal();
  }

};
// =========================
// Music Player
// =========================

document.addEventListener("DOMContentLoaded", () => {

  const music = document.getElementById("memoryMusic");
  const musicBtn = document.getElementById("musicBtn");
  const musicProgress = document.getElementById("musicProgress");
  const musicVolume = document.getElementById("musicVolume");

  // التأكد أن عناصر الموسيقى موجودة
  if (!music || !musicBtn || !musicProgress || !musicVolume) {
    console.error("Music player elements not found");
    return;
  }

  // مستوى الصوت
  music.volume = 0.7;

  // =========================
  // تشغيل / إيقاف الأغنية
  // =========================

  musicBtn.addEventListener("click", async () => {

    if (music.paused) {

      try {

        await music.play();

        musicBtn.textContent = "❚❚";

      } catch (error) {

        console.error("Cannot play music:", error);

        musicBtn.textContent = "▶";

        alert("مش قادر أشغل الأغنية. تأكد إن ملف memories.mp3 موجود داخل مجلد music.");

      }

    } else {

      music.pause();

      musicBtn.textContent = "▶";

    }

  });


  // =========================
  // تحديث شريط التقدم
  // =========================

  music.addEventListener("timeupdate", () => {

    if (
      !music.duration ||
      !isFinite(music.duration)
    ) {
      return;
    }

    const progress =
      (music.currentTime / music.duration) * 100;

    musicProgress.value = progress;

  });


  // =========================
  // تغيير مكان الأغنية
  // =========================

  musicProgress.addEventListener("input", () => {

    if (
      !music.duration ||
      !isFinite(music.duration)
    ) {
      return;
    }

    music.currentTime =
      (musicProgress.value / 100) * music.duration;

  });


  // =========================
  // التحكم في الصوت
  // =========================

  musicVolume.addEventListener("input", () => {

    music.volume =
      Number(musicVolume.value);

  });


  // =========================
  // عند تشغيل الأغنية
  // =========================

  music.addEventListener("play", () => {

    musicBtn.textContent = "❚❚";

  });


  // =========================
  // عند إيقاف الأغنية
  // =========================

  music.addEventListener("pause", () => {

    musicBtn.textContent = "▶";

  });


  // =========================
  // عند انتهاء الأغنية
  // =========================

  music.addEventListener("ended", () => {

    musicBtn.textContent = "▶";

  });

});