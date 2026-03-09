// ==================== Firebase (โหลดผ่าน CDN compat — ไม่ต้องใช้ import) ====================
// หมายเหตุ: ต้องใส่ใน index.html ก่อน script นี้:
// <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js"></script>

const firebaseConfig = {
    apiKey: "AIzaSyD_tIAHA7tWS_21w-_J7GHxLA_eDxC7qX8",
    authDomain: "benjama-club-45bf3.firebaseapp.com",
    databaseURL: "https://benjama-club-45bf3-default-rtdb.firebaseio.com",
    projectId: "benjama-club-45bf3",
    storageBucket: "benjama-club-45bf3.firebasestorage.app",
    messagingSenderId: "257453794303",
    appId: "1:257453794303:web:8a80688dce863cbfb17dca"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==================== Apps Script ====================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwIEF0K4z7d9i1YnCVqTpXoaA_chCOBCS3SPIdM1sTz1afydtgfGmjY8a2jz9oKpUQc/exec";
const FETCH_TIMEOUT_MS = 15000;

// ==================== helper: fetch พร้อม timeout ====================
async function fetchWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        return res;
    } catch (err) {
        clearTimeout(timer);
        if (err.name === 'AbortError') throw new Error('TIMEOUT');
        throw err;
    }
}

// ==================== helper: Firebase compat wrappers ====================
function dbGet(path) {
    return db.ref(path).get();
}
function dbSet(path, value) {
    return db.ref(path).set(value);
}
function dbRemove(path) {
    return db.ref(path).remove();
}
function dbTransaction(path, updateFn) {
    return db.ref(path).transaction(updateFn);
}

// ==================== helper: แปลงชื่อเป็น key ====================
function toKey(str) {
    return str.replace(/[.#$/\[\]]/g, '_');
}

// ==================== helper: loading button ====================
function setLoading(btn, loading, defaultText) {
    btn.disabled = loading;
    btn.innerText = loading ? "⏳ กำลังดำเนินการ..." : defaultText;
}

// ==================== ชุมนุม ม.ต้น ====================
const clubsJunior = [
    { name: "Freestyle by Science (นายธนวิน จันทร)", capacity: 25 },
    { name: "Freedom.G (นางสาวผกาแก้ว ชัยยะ / นางสาววาณี เก่งการทำ)", capacity: 40 },
    { name: "เพลิน and play (นางสาวชนชนก นามโสม / นางสาวมัลลิกา เหลยชัย)", capacity: 40 },
    { name: "Science X Cinema (นางสาววิชชญา กันบุรมย์)", capacity: 25 },
    { name: "เพื่อนที่ปรึกษา (Youth Counselor: YC) (นายรัชพล พลวงค์ษา / นางสาวทิพยรัตน์ อยู่แท้กูล)", capacity: 40 },
    { name: "DIY หรรษา (นางสาวกฤติยา โสภิณ / นางสาวมัญชุสร รัตนะ)", capacity: 40 },
    { name: "เสน่ห์ปลายจวัก (นางสาวสลิลดา พิชยกัลป์ / นายธนกร แสงผ่อง)", capacity: 40 },
    { name: "รอบรู้รัตนโกสินทร์ (นางสาวจุฑารัตน์ สมงาม / นางสาวธันยวีย์ แสนคำทุม)", capacity: 40 },
    { name: "ดูหนังหลังเลิกเรียน: English on Screen (นางสาวหทัยภัทร บุญสิงห์ / นายพุทธิวัฒน์ จัยสิน)", capacity: 40 },
    { name: "my crafts สร้างสรรค์หรรษา (นายฉัตรมงคล แก้วมณี / นายคุณานนต์ สาสีเสาร์)", capacity: 40 },
    { name: "Enjoy with Youtube (นางสาวมินิมล อ่อนจันทร์)", capacity: 25 },
    { name: "A-Math & Four Stars (นายศาศวัต คงกะเรียน / นางสาวจันทร์จิรา นวกุล)", capacity: 40 },
    { name: "Chinese DIY (นางสาวลลิตา เกรียงเจริญศิริ / นางสาววิภาวี อนุจาผัด)", capacity: 40 },
    { name: "โลกศิลปะ (นายกฤษฎา วัฒนศิลป์)", capacity: 40 },
    { name: "บาสเกตบอล (นายธวัชชัย ตั้งสุรธีรวงศ์ / นายพิฑูร กิจประเสริฐ)", capacity: 25 },
    { name: "ชุมนุมกีฬาบริดจ์ (นายผดุงศักดิ์ บูรณะสมบัติ)", capacity: 25 },
    { name: "หมากกระดาน (นายภัทรรัตน์ ปิยะภัทรสกุล / นายธนภูมิ ท้าวมะลิ)", capacity: 25 },
    { name: "พิมพ์ดีด-พิมพ์ใจ (นางสาวณัชชนม์ สุวรรณธาดา / นางสาวนพพร วาอุทัศน์)", capacity: 25 },
    { name: "ภารกิจพิชิตดิจิทัล (นางจิตราภรณ์ บัวจำรัส / นางสาวเพชรรัตน์ มหรรชกุล)", capacity: 25 },
    { name: "Crossword: To Be The Star (นางสาวปนิตา ยืนยาว / นายคณิน รักเกียรติสกุล / นางอรวรรณ แสแสงสีรุ้ง)", capacity: 25 },
    { name: "ครูสาวน่าอีส (นางสาวสุดารัตน์ พลโภชน์ / นายธนิสร ศิริกุล)", capacity: 25 },
    { name: "English Club (Keith Pearson / Jack Batty Sewina / Steven Kiyooka)", capacity: 25 },
    { name: "ภาษา พาที (นางสาวลินดา เนียมเพราะ / นางสาวปัญญาพร พลีดี / นางสาวโชติกา ไตรเภทพิสัย)", capacity: 25 },
    { name: "มูเตลู (นางสาวณฐพรรณ เจนปัญญากุล / นายนาร์ท สายทองติ่ง)", capacity: 25 },
    { name: "สร้างสรรค์ปั้นดินไทย (นางสาวโสรยา สุธาพจน์ / นางสาวศุภัสรา มิ่งแมน)", capacity: 25 },
    { name: "ดนตรีไทย (ครูสุริยพงษ์ บุญโกมล)", capacity: 15 },
    { name: "ศิลปะเพื่อการแข่งขัน (นางสาวจุฑามาศ ทิพยกระมล / นายทรงยศ คำอยู่)", capacity: 25 },
    { name: "นาฏศิลป์ (นายเอกชัย แตบสวัสดิ์ / ครูนาฏศิลป์ อัตราจ้าง)", capacity: 25 },
    { name: "วงโยธวาทิต (นายรุ่งโรจน์ ศรีสังข์ / นายยงยศ สง่าวงษ์)", capacity: 25 },
    { name: "ว่ายน้ำ (นางสาววารินทร์ เกตุเกลี้ยง / นางสาวเบญญทิพย์ เขียวราชา)", capacity: 25 },
    { name: "โอ้เอ้วิหารราย (นางสาวยุวดี ว่องสกุลกฤษฎา / นางสาวสว่างจิต แก้วถนัด / นายภควรรษ รอดความทุกข์)", capacity: 30 }
];

// ==================== ชุมนุม ม.ปลาย ====================
const clubsSenior = [
    { name: "SMTE ม.ปลาย (นางสาวมินตรา กระเป๋าทอง)", capacity: 25 },
    { name: "E-Sport (นายสุทธิพงศ์ อาศิรพจน์)", capacity: 25 },
    { name: "มิตรภาพบอร์ดเกม (ว่าที่ร.ต.มัฆวัตว์ แสนบุญศิริ / นายพรพงศ์ ทองคำ)", capacity: 40 },
    { name: "วิทย์น่าสนุก (นางสาวกวิสรา ทรงอาวุธ / นางสาวยุวรัตน์ สมบัติคีรีไพบูลย์)", capacity: 25 },
    { name: "Smart Consumer Lab นักสืบสินค้า (นางมะลิวัลย์ ประทุมทอง / นางสาวสุพัตรา ไทยกุล)", capacity: 40 },
    { name: "นักล่าของอร่อย (ว่าที่ร้อยตรีหญิงปาริชาติ ธรรมสุวรรณ / นายณิชชภา อโนมา)", capacity: 40 },
    { name: "จินตคณิต (นางสาวกรรณิกา ชินวิวัฒนผล / นางสาวนันทวัน สิงห์สังข์)", capacity: 40 },
    { name: "คณิตคิดไปเรื่อย (นางสาวนันทวัลย์ เฟื่องฟู / นายธัชณวีย์ สุขทรัพย์)", capacity: 40 },
    { name: "Art of Math (นางสาวลลิต วรกาญจน์ / นางสาวทฤฒมน บรรจงรอด)", capacity: 40 },
    { name: "French for the neighborhood of Sao Ching Cha (นางสาวกานต์ชนก สมภักดี / นายวรพล ขำปาน)", capacity: 40 },
    { name: "หนังเปิดโลก (ว่าที่ร้อยตรีปรเมธ เทพขวัญ / นางสาวจงกลกร เลือดทหาร)", capacity: 40 },
    { name: "A-Level คณิตศาสตร์ (ครูนพกร จิราศักดิ์เกษม)", capacity: 25 },
    { name: "Guidance & Growth Club (ครูวัสสิกา นุ่นทอง)", capacity: 25 },
    { name: "ECO Craft & Culture Club (นางสาวดารากันย์ เจริญจิต / นางสาวนิตยา อาจเดช)", capacity: 40 },
    { name: "เล่นให้เป็นคน (นายตรัยรัตน์ บุญพา / นายธนพล ห้วยหงษ์ทอง)", capacity: 40 },
    { name: "Drama and Film (นางสาวพิมพลอย รัตนมาศ / นายธิติพงศ์ จุรุฑา)", capacity: 40 },
    { name: "รอบรู้รอบรั้วโรงเรียน (นายไพรัตน์ ลิ้มปองทรัพย์)", capacity: 25 },
    { name: "Hello World: ท่องโลก 3 สไตล์ (นายวิทยา ศรีสร้อย / นางสาวพิมพ์พรรณ มโนมัยฤนาท)", capacity: 40 },
    { name: "อะไรจีน จีน (นางสาวจิรพร เข็มเพ็ชร์ / ครูอาสาสมัครจีน)", capacity: 40 },
    { name: "วิทยากรรุ่นเยาว์ (นายรุ่งโรจน์ ติดมา)", capacity: 25 },
    { name: "บาสเกตบอล (นายธวัชชัย ตั้งสุรธีรวงศ์ / นายพิฑูร กิจประเสริฐ)", capacity: 15 },
    { name: "ชุมนุมกีฬาบริดจ์ (นายผดุงศักดิ์ บูรณะสมบัติ)", capacity: 15 },
    { name: "หมากกระดาน (นายภัทรรัตน์ ปิยะภัทรสกุล / นายธนภูมิ ท้าวมะลิ)", capacity: 15 },
    { name: "พิมพ์ดีด-พิมพ์ใจ (นางสาวณัชชนม์ สุวรรณธาดา / นางสาวนพพร วาอุทัศน์)", capacity: 15 },
    { name: "ภารกิจพิชิตดิจิทัล (นางจิตราภรณ์ บัวจำรัส / นางสาวเพชรรัตน์ มหรรชกุล)", capacity: 15 },
    { name: "Crossword: To Be The Star (นางสาวปนิตา ยืนยาว / นายคณิน รักเกียรติสกุล / นางอรวรรณ แสแสงสีรุ้ง)", capacity: 15 },
    { name: "ครูสาวน่าอีส (นางสาวสุดารัตน์ พลโภชน์ / นายธนิสร ศิริกุล)", capacity: 15 },
    { name: "English Club (Keith Pearson / Jack Batty Sewina / Steven Kiyooka)", capacity: 15 },
    { name: "ภาษา พาที (นางสาวลินดา เนียมเพราะ / นางสาวปัญญาพร พลีดี / นางสาวโชติกา ไตรเภทพิสัย)", capacity: 15 },
    { name: "มูเตลู (นางสาวณฐพรรณ เจนปัญญากุล / นายนาร์ท สายทองติ่ง)", capacity: 15 },
    { name: "สร้างสรรค์ปั้นดินไทย (นางสาวโสรยา สุธาพจน์ / นางสาวศุภัสรา มิ่งแมน)", capacity: 15 },
    { name: "ดนตรีไทย (ครูสุริยพงษ์ บุญโกมล)", capacity: 10 },
    { name: "ศิลปะเพื่อการแข่งขัน (นางสาวจุฑามาศ ทิพยกระมล / นายทรงยศ คำอยู่)", capacity: 15 },
    { name: "นาฏศิลป์ (นายเอกชัย แตบสวัสดิ์ / ครูนาฏศิลป์ อัตราจ้าง)", capacity: 15 },
    { name: "วงโยธวาทิต (นายรุ่งโรจน์ ศรีสังข์ / นายยงยศ สง่าวงษ์)", capacity: 15 },
    { name: "ว่ายน้ำ (นางสาววารินทร์ เกตุเกลี้ยง / นางสาวเบญญทิพย์ เขียวราชา)", capacity: 15 },
    { name: "โอ้เอ้วิหารราย (นางสาวยุวดี ว่องสกุลกฤษฎา / นางสาวสว่างจิต แก้วถนัด / นายภควรรษ รอดความทุกข์)", capacity: 20 }
];

// ==================== LOGIN ====================
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const id    = document.getElementById('login-id').value.trim();

    if (!email.endsWith('@br.ac.th')) {
        alert("❌ กรุณาใช้อีเมล @br.ac.th เท่านั้น");
        return;
    }
    if (id.length === 0) {
        alert("❌ กรุณากรอกเลขประจำตัว");
        return;
    }

    const btn = document.querySelector('#login-section .btn-main');
    setLoading(btn, true, "เข้าสู่ระบบ");

    try {
        const res = await fetchWithTimeout(
            `${SCRIPT_URL}?action=verify&email=${encodeURIComponent(email)}&studentId=${encodeURIComponent(id)}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        if (result.status === "ok") {
            document.getElementById('email').value = email;
            document.getElementById('studentId').value = id;
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('registration-section').style.display = 'block';
            await checkExistingEnrollment(id, email);
        } else {
            alert("❌ อีเมลหรือเลขประจำตัวไม่ถูกต้อง\nกรุณาตรวจสอบอีกครั้ง");
        }
    } catch (err) {
        if (err.message === 'TIMEOUT') {
            alert("⏱️ ระบบตอบสนองช้าเกินไป\nกรุณารอสักครู่แล้วลองใหม่อีกครั้ง");
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            alert("🌐 ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้\nกรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่");
        } else {
            alert("⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่\n(" + err.message + ")");
        }
    } finally {
        setLoading(btn, false, "เข้าสู่ระบบ");
    }
}

// ==================== ตรวจสอบการลงทะเบียนเดิม ====================
async function checkExistingEnrollment(studentId, email = '') {
    try {
        const snap = await dbGet(`registrations/${toKey(studentId)}`);
        if (snap.exists()) {
            const data = snap.val();
            document.getElementById('registration-section').innerHTML = `
                <div style="text-align:right; margin-bottom:10px;">
                    <button onclick="logoutStudent()" style="padding:8px 16px; background:#6c757d; color:white; border:none; border-radius:5px; cursor:pointer;">🚪 ออกจากระบบ</button>
                </div>
                <div style="text-align:center; padding:30px; background:#e8f5e9; border-radius:10px; margin-bottom:20px;">
                    <h2 style="color:green;">✅ คุณลงทะเบียนชุมนุมแล้ว</h2>
                    <p style="font-size:18px;">ชุมนุม: <strong>${data.club}</strong></p>
                    <p style="color:#555;">ห้อง: ${data.classroom} เลขที่ ${data.no}</p>
                    <p style="color:#888; font-size:13px;">ลงทะเบียนเมื่อ: ${data.timestamp}</p>
                    <hr style="margin:20px 0;">
                    <p style="color:#666; margin-bottom:15px;">ต้องการยกเลิกและเลือกชุมนุมใหม่?</p>
                    <button onclick="cancelEnrollment()" id="cancel-btn" style="padding:10px 24px; background:#dc3545; color:white; border:none; border-radius:5px; cursor:pointer; font-size:16px;">
                        ❌ ยกเลิกการลงทะเบียน
                    </button>
                </div>
                <input type="hidden" id="studentId" value="${studentId}">
                <input type="hidden" id="email" value="${data.email || email}">
            `;
        }
    } catch (err) {
        console.error("checkExistingEnrollment error:", err);
    }
}

// ==================== ยกเลิกการลงทะเบียน ====================
async function cancelEnrollment() {
    const studentId = document.getElementById('studentId').value;
    const email     = document.getElementById('email').value;

    if (!confirm("⚠️ ยืนยันการยกเลิกการลงทะเบียนชุมนุม?")) return;

    const btn = document.getElementById('cancel-btn');
    if (btn) setLoading(btn, true, "❌ ยกเลิกการลงทะเบียน");

    try {
        const snap = await dbGet(`registrations/${toKey(studentId)}`);
        if (snap.exists()) {
            const data    = snap.val();
            const clubKey = toKey(data.club);
            await dbRemove(`registrations/${toKey(studentId)}`);
            await dbTransaction(`clubs/${clubKey}/count`, (current) => Math.max(0, (current || 0) - 1));
        }
        alert("✅ ยกเลิกการลงทะเบียนสำเร็จ กรุณาเลือกชุมนุมใหม่");
        showRegistrationForm(studentId, email);
    } catch (err) {
        alert("⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่: " + err.message);
        if (btn) setLoading(btn, false, "❌ ยกเลิกการลงทะเบียน");
    }
}

// ==================== แสดงฟอร์มลงทะเบียน ====================
function showRegistrationForm(studentId = '', email = '') {
    document.getElementById('registration-section').innerHTML = `
        <div style="text-align:right; margin-bottom:10px;">
            <button onclick="logoutStudent()" style="padding:8px 16px; background:#6c757d; color:white; border:none; border-radius:5px; cursor:pointer;">🚪 ออกจากระบบ</button>
        </div>
        <div class="level-selector">
            <button id="btn-junior" onclick="selectLevel('junior')" class="btn-level">มัธยมศึกษาตอนต้น</button>
            <button id="btn-senior" onclick="selectLevel('senior')" class="btn-level">มัธยมศึกษาตอนปลาย</button>
        </div>
        <form id="enroll-form" style="display:none;">
            <div class="form-grid">
                <input type="text" id="name" placeholder="ชื่อ-นามสกุล" required>
                <input type="text" id="studentId" placeholder="เลขประจำตัว" readonly value="${studentId}">
                <input type="email" id="email" placeholder="อีเมล" readonly value="${email}">
                <select id="classroom" required></select>
                <input type="number" id="no" placeholder="เลขที่" required min="1" max="60">
                <select id="club" required>
                    <option value="">-- กรุณาเลือกชุมนุม --</option>
                </select>
            </div>
            <div id="club-status" style="margin:8px 0; font-size:14px; color:#555; min-height:20px;"></div>
            <button type="submit" id="submit-btn" class="btn-main">ยืนยันการลงทะเบียน</button>
        </form>
    `;
    document.getElementById('enroll-form').onsubmit = handleSubmit;
}

// ==================== เลือกระดับชั้น ====================
async function selectLevel(level) {
    const classSelect = document.getElementById('classroom');
    const clubSelect  = document.getElementById('club');
    const form        = document.getElementById('enroll-form');

    classSelect.innerHTML = '<option value="">เลือกห้องเรียน</option>';
    const startGrade = level === 'junior' ? 1 : 4;
    for (let g = startGrade; g <= startGrade + 2; g++) {
        for (let r = 1; r <= 9; r++) {
            let opt = document.createElement('option');
            opt.value = `${g}/${r}`; opt.text = `${g}/${r}`;
            classSelect.add(opt);
        }
    }

    const clubs = level === 'junior' ? clubsJunior : clubsSenior;
    clubSelect.innerHTML = '<option value="">⏳ กำลังโหลดข้อมูลชุมนุม...</option>';
    clubSelect.disabled = true;

    let countsSnap = {};
    try {
        const snap = await dbGet('clubs');
        if (snap.exists()) countsSnap = snap.val();
    } catch (_) {}

    clubSelect.innerHTML = '<option value="">-- กรุณาเลือกชุมนุม --</option>';
    clubs.forEach(c => {
        const key    = toKey(c.name);
        const count  = (countsSnap[key] && countsSnap[key].count) ? countsSnap[key].count : 0;
        const left   = c.capacity - count;
        const isFull = left <= 0;
        let opt = document.createElement('option');
        opt.value = c.name;
        opt.dataset.capacity = c.capacity;
        if (isFull) {
            opt.text = `🔴 ${c.name} (เต็มแล้ว)`;
            opt.disabled = true;
        } else if (left <= 5) {
            opt.text = `🟡 ${c.name} (เหลือ ${left} ที่)`;
        } else {
            opt.text = `🟢 ${c.name} (เหลือ ${left} ที่)`;
        }
        clubSelect.add(opt);
    });
    clubSelect.disabled = false;

    clubSelect.onchange = async () => {
        const statusEl    = document.getElementById('club-status');
        const selectedOpt = clubSelect.options[clubSelect.selectedIndex];
        if (!clubSelect.value || !statusEl) return;
        const key      = toKey(clubSelect.value);
        const capacity = parseInt(selectedOpt.dataset.capacity) || 25;
        try {
            const snap  = await dbGet(`clubs/${key}/count`);
            const count = snap.exists() ? snap.val() : 0;
            const left  = capacity - count;
            if (left <= 0) {
                statusEl.innerHTML = `<span style="color:red;">🔴 ชุมนุมนี้เต็มแล้ว (${count}/${capacity})</span>`;
            } else if (left <= 5) {
                statusEl.innerHTML = `<span style="color:orange;">🟡 ที่นั่งเหลือน้อย: ${left} ที่จากทั้งหมด ${capacity} ที่</span>`;
            } else {
                statusEl.innerHTML = `<span style="color:green;">🟢 ที่นั่งว่าง: ${left} ที่จากทั้งหมด ${capacity} ที่</span>`;
            }
        } catch (_) {
            statusEl.innerHTML = '';
        }
    };

    form.style.display = 'block';
    document.querySelectorAll('.btn-level').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${level}`).classList.add('active');
}

// ==================== ส่งฟอร์มลงทะเบียน ====================
async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = document.getElementById('submit-btn');
    setLoading(btn, true, "ยืนยันการลงทะเบียน");

    const clubSelect     = document.getElementById('club');
    const selectedOption = clubSelect.options[clubSelect.selectedIndex];
    const clubName       = clubSelect.value;
    const capacity       = parseInt(selectedOption.dataset.capacity) || 25;
    const studentId      = document.getElementById('studentId').value;
    const email          = document.getElementById('email').value;
    const name           = document.getElementById('name').value.trim();
    const classroom      = document.getElementById('classroom').value;
    const no             = document.getElementById('no').value;

    if (!name)      { alert("❌ กรุณากรอกชื่อ-นามสกุล");  setLoading(btn, false, "ยืนยันการลงทะเบียน"); return; }
    if (!classroom) { alert("❌ กรุณาเลือกห้องเรียน");     setLoading(btn, false, "ยืนยันการลงทะเบียน"); return; }
    if (!no)        { alert("❌ กรุณากรอกเลขที่");          setLoading(btn, false, "ยืนยันการลงทะเบียน"); return; }
    if (!clubName)  { alert("❌ กรุณาเลือกชุมนุม");         setLoading(btn, false, "ยืนยันการลงทะเบียน"); return; }

    const clubKey    = toKey(clubName);
    const studentKey = toKey(studentId);

    try {
        // 1. ตรวจสอบเวลาเปิด-ปิด
        const grade    = parseInt(classroom.split('/')[0]);
        const isJunior = grade <= 3;
        try {
            const timeRes  = await fetchWithTimeout(`${SCRIPT_URL}?action=getTime`);
            const timeData = await timeRes.json();
            const openKey  = isJunior ? 'juniorOpen'  : 'seniorOpen';
            const closeKey = isJunior ? 'juniorClose' : 'seniorClose';
            if (timeData[openKey] && timeData[closeKey]) {
                const now   = new Date();
                const open  = new Date(timeData[openKey]);
                const close = new Date(timeData[closeKey]);
                if (now < open || now > close) {
                    alert(`❌ ขณะนี้ปิดรับสมัครชุมนุม${isJunior ? 'ม.ต้น' : 'ม.ปลาย'}แล้ว`);
                    setLoading(btn, false, "ยืนยันการลงทะเบียน");
                    return;
                }
            }
        } catch (timeErr) {
            console.warn("getTime timeout/error, skipping:", timeErr.message);
        }

        // 2. ตรวจสอบลงทะเบียนซ้ำ
        const existSnap = await dbGet(`registrations/${studentKey}`);
        if (existSnap.exists()) {
            alert("⚠️ คุณลงทะเบียนชุมนุมไปแล้ว ไม่สามารถลงซ้ำได้");
            setLoading(btn, false, "ยืนยันการลงทะเบียน");
            return;
        }

        // 3. Transaction เพิ่ม count
        let full = false;
        await dbTransaction(`clubs/${clubKey}/count`, (current) => {
            const count = current || 0;
            if (count >= capacity) { full = true; return; }
            return count + 1;
        });

        if (full) {
            alert("❌ ชุมนุมนี้เต็มแล้ว กรุณาเลือกชุมนุมอื่น");
            setLoading(btn, false, "ยืนยันการลงทะเบียน");
            return;
        }

        // 4. บันทึกข้อมูลนักเรียนลง Firebase
        const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
        await dbSet(`registrations/${studentKey}`, {
            timestamp, email, studentId, no, classroom, name, club: clubName
        });

        // 5. ส่งข้อมูลไป Google Sheets ด้วย (background — ไม่บล็อกถ้า Sheets ช้าหรือ error)
        try {
            const sheetsUrl = `${SCRIPT_URL}?action=write`
                + `&timestamp=${encodeURIComponent(timestamp)}`
                + `&email=${encodeURIComponent(email)}`
                + `&studentId=${encodeURIComponent(studentId)}`
                + `&no=${encodeURIComponent(no)}`
                + `&classroom=${encodeURIComponent(classroom)}`
                + `&name=${encodeURIComponent(name)}`
                + `&club=${encodeURIComponent(clubName)}`;
            await fetchWithTimeout(sheetsUrl, 10000);
        } catch (sheetsErr) {
            // Sheets ล้มเหลวไม่กระทบ Firebase — บันทึกไว้ใน console เท่านั้น
            console.warn("Google Sheets sync failed (ไม่กระทบข้อมูลหลัก):", sheetsErr.message);
        }

        document.getElementById('registration-section').innerHTML = `
            <div style="text-align:center; padding:40px; background:#e8f5e9; border-radius:10px;">
                <h2 style="color:green; font-size:28px;">✅ ลงทะเบียนสำเร็จ!</h2>
                <p style="font-size:18px; margin:10px 0;">ชื่อ: <strong>${name}</strong></p>
                <p style="font-size:18px;">ชุมนุม: <strong>${clubName}</strong></p>
                <p style="color:#555;">ห้อง ${classroom} เลขที่ ${no}</p>
                <p style="color:#888; font-size:13px;">เวลา: ${timestamp}</p>
                <hr style="margin:20px 0;">
                <button onclick="logoutStudent()" style="padding:10px 24px; background:#6c757d; color:white; border:none; border-radius:5px; cursor:pointer; font-size:15px;">🚪 ออกจากระบบ</button>
            </div>`;

    } catch (err) {
        if (err.message === 'TIMEOUT') {
            alert("⏱️ ระบบตอบสนองช้าเกินไป กรุณาลองใหม่อีกครั้ง");
        } else {
            alert("⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่: " + err.message);
        }
        setLoading(btn, false, "ยืนยันการลงทะเบียน");
    }
}

// ==================== ออกจากระบบ ====================
function logoutStudent() {
    document.getElementById('registration-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('login-email').value = '';
    document.getElementById('login-id').value = '';
    showRegistrationForm();
}

// ==================== Enter key ====================
document.getElementById('login-id').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleLogin();
});
document.getElementById('login-email').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleLogin();
});