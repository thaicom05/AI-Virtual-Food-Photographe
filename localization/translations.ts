
export const translations = {
  en: {
    header: {
      title: 'AI Menu Architect',
      subtitle: 'Describe your dishes, pick a style, and let AI do the rest.',
    },
    sidebar: {
        generator: 'Image Generator',
        history: 'History',
        menuBuilder: 'Menu Builder',
    },
    generator: {
        title: 'AI Virtual Food Photographer',
    },
    form: {
      label: 'Enter your menu items (one per line, e.g., "Dish Name - Price")',
      placeholder: 'Example:\nClassic Cheeseburger - 250\nSpicy Tom Yum Noodles - 180\nChocolate Lava Cake - 150',
      styleLabel: 'Photography Style',
      button: 'Start Photoshoot',
      buttonLoading: 'Generating...',
    },
    style: {
      'Rustic/Dark': 'Rustic/Dark',
      'Bright/Modern': 'Bright/Modern',
      'Social Media (Flat Lay)': 'Social Media (Flat Lay)',
    },
    menuDisplay: {
      title: 'Your Generated Menu',
    },
    menuItem: {
      priceLabel: 'Price:',
      editButton: 'Edit Image',
      downloadButton: 'Download Image',
    },
    history: {
        title: 'Prompt & Image History',
        subtitle: 'Review, reuse, or add your previously generated images to a menu.',
        emptyTitle: 'No History Yet',
        emptySubtitle: 'Generated images will appear here.',
        addToMenu: 'Add to Menu',
        download: 'Download',
        delete: 'Delete',
        confirmDelete: 'Are you sure you want to delete this item from history?',
    },
    menuBuilder: {
        title: 'Menu Book Builder',
        subtitle: 'Create a professional, print-ready menu in 5 minutes.',
        paperSize: 'Paper Size',
        portrait: 'A4 Portrait',
        landscape: 'A4 Landscape',
        a5: 'A5',
        theme: 'Theme',
        exportPdf: 'Download Menu (PDF)',
        noPages: 'Add items from your history to begin building your menu.',
        noHistory: 'Generate some images first to add them to your menu.',
        layout: {
            textPrice: { title: 'Text & Price', desc: 'Simple, clean list. Best for quick menus.' },
            imagePrice: { title: 'Image & Price', desc: 'Standard layout. Great for most restaurants.' },
            imageDescPrice: { title: 'Image, Details & Price', desc: 'Premium feel. Perfect for up-selling dishes.' },
        },
        advancedSettings: {
            title: 'Advanced Settings',
            gridCols: 'Grid Columns',
            gridRows: 'Grid Rows',
            itemSpacing: 'Item Spacing'
        }
    },
    themes: {
        Thai: 'Modern Thai',
        Cafe: 'Cozy Cafe',
        Japanese: 'Minimalist Japanese',
        FineDining: 'Elegant Fine Dining',
        Bakery: 'Sweet Bakery',
    },
    modal: {
      title: 'Edit Image: {name}',
      label: 'What change would you like to make?',
      placeholder: 'e.g., Add a retro filter, remove the fork, make it look more vibrant...',
      cancel: 'Cancel',
      confirm: 'Apply Edit',
    },
    loader: {
      analyzing: 'Analyzing menu and preparing the studio...',
      parsing: 'Parsing menu items and generating creative concepts...',
      photographing: 'Photographing "{name}" ({current} of {total})...',
      rateLimitWait: 'Pausing briefly to respect API limits...',
      complete: 'Photoshoot complete!',
      editing: 'Applying your edit: "{prompt}"...',
    },
    error: {
      emptyMenu: 'Please enter at least one menu item.',
      generationFailed: 'Failed to generate menu. Please check your input and try again.',
      editFailed: 'Failed to edit the image. Please try again.',
    },
    welcome: {
      title: 'Ready for your closeup?',
      subtitle: 'Enter your menu above to begin the photoshoot.',
    },
    footer: 'Powered by Gemini API',
    langToggle: 'TH',
    currency: {
      unit: 'Baht',
    },
  },
  th: {
    header: {
      title: 'AI สถาปนิกเมนู',
      subtitle: 'บรรยายอาหารของคุณ เลือกสไตล์ แล้วให้ AI จัดการที่เหลือ',
    },
    sidebar: {
        generator: 'สร้างภาพ',
        history: 'ประวัติ',
        menuBuilder: 'สร้างเมนู',
    },
    generator: {
        title: 'AI ช่างภาพอาหารเสมือนจริง',
    },
    form: {
      label: 'ป้อนรายการเมนู (หนึ่งรายการต่อบรรทัด เช่น "ชื่ออาหาร - ราคา")',
      placeholder: 'ตัวอย่าง:\nคลาสสิกชีสเบอร์เกอร์ - 250\nก๋วยเตี๋ยวต้มยำรสเด็ด - 180\nช็อกโกแลตลาวาเค้ก - 150',
      styleLabel: 'สไตล์การถ่ายภาพ',
      button: 'เริ่มถ่ายภาพ',
      buttonLoading: 'กำลังสร้าง...',
    },
    style: {
      'Rustic/Dark': 'รัสติก/ดาร์ก',
      'Bright/Modern': 'สว่าง/โมเดิร์น',
      'Social Media (Flat Lay)': 'โซเชียลมีเดีย (มุมสูง)',
    },
    menuDisplay: {
      title: 'เมนูที่สร้างของคุณ',
    },
    menuItem: {
      priceLabel: 'ราคา:',
      editButton: 'แก้ไขรูปภาพ',
      downloadButton: 'ดาวน์โหลดรูปภาพ',
    },
    history: {
        title: 'ประวัติ Prompt และรูปภาพ',
        subtitle: 'ดู, ใช้ซ้ำ, หรือเพิ่มรูปภาพที่เคยสร้างไว้ไปยังเมนูของคุณ',
        emptyTitle: 'ยังไม่มีประวัติ',
        emptySubtitle: 'รูปภาพที่สร้างแล้วจะปรากฏที่นี่',
        addToMenu: 'เพิ่มไปยังเมนู',
        download: 'ดาวน์โหลด',
        delete: 'ลบ',
        confirmDelete: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ออกจากประวัติ?',
    },
    menuBuilder: {
        title: 'เครื่องมือสร้างเล่มเมนู',
        subtitle: 'สร้างเมนูระดับมืออาชีพพร้อมพิมพ์ใน 5 นาที',
        paperSize: 'ขนาดกระดาษ',
        portrait: 'A4 แนวตั้ง',
        landscape: 'A4 แนวนอน',
        a5: 'A5',
        theme: 'ธีม',
        exportPdf: 'ดาวน์โหลดเมนู (PDF)',
        noPages: 'เพิ่มรายการจากประวัติเพื่อเริ่มสร้างเมนูของคุณ',
        noHistory: 'กรุณาสร้างรูปภาพก่อนเพื่อนำมาใส่ในเมนู',
        layout: {
            textPrice: { title: 'ข้อความ + ราคา', desc: 'เรียบง่าย สะอาดตา เหมาะสำหรับเมนูเร็วๆ' },
            imagePrice: { title: 'รูปภาพ + ราคา', desc: 'รูปแบบมาตรฐาน เหมาะกับร้านอาหารส่วนใหญ่' },
            imageDescPrice: { title: 'รูปภาพ + รายละเอียด + ราคา', desc: 'ให้ความรู้สึกพรีเมียม เหมาะกับการเพิ่มมูลค่าอาหาร' },
        },
        advancedSettings: {
            title: 'ตั้งค่าขั้นสูง',
            gridCols: 'จำนวนคอลัมน์',
            gridRows: 'จำนวนแถว',
            itemSpacing: 'ระยะห่าง'
        }
    },
     themes: {
        Thai: 'ไทยโมเดิร์น',
        Cafe: 'คาเฟ่อบอุ่น',
        Japanese: 'ญี่ปุ่นมินิมอล',
        FineDining: 'Fine Dining หรูหรา',
        Bakery: 'เบเกอรี่แสนหวาน',
    },
    modal: {
      title: 'แก้ไขรูปภาพ: {name}',
      label: 'คุณต้องการเปลี่ยนแปลงอะไร?',
      placeholder: 'เช่น เพิ่มฟิลเตอร์เรโทร, เอามีดออก, ทำให้สีสดใสขึ้น...',
      cancel: 'ยกเลิก',
      confirm: 'ใช้การแก้ไข',
    },
    loader: {
      analyzing: 'กำลังวิเคราะห์เมนูและเตรียมสตูดิโอ...',
      parsing: 'กำลังแยกวิเคราะห์รายการเมนูและสร้างแนวคิด...',
      photographing: 'กำลังถ่ายภาพ "{name}" ({current} จาก {total})...',
      rateLimitWait: 'หยุดชั่วครู่เพื่อให้เป็นไปตามข้อจำกัด API...',
      complete: 'ถ่ายภาพเสร็จสมบูรณ์!',
      editing: 'กำลังใช้การแก้ไข: "{prompt}"...',
    },
    error: {
      emptyMenu: 'กรุณาป้อนรายการเมนูอย่างน้อยหนึ่งรายการ',
      generationFailed: 'ไม่สามารถสร้างเมนูได้ กรุณาตรวจสอบข้อมูลและลองอีกครั้ง',
      editFailed: 'ไม่สามารถแก้ไขรูปภาพได้ กรุณาลองอีกครั้ง',
    },
    welcome: {
        title: 'พร้อมสำหรับการถ่ายภาพแล้วหรือยัง?',
        subtitle: 'ป้อนเมนูของคุณด้านบนเพื่อเริ่มการถ่ายภาพ',
    },
    footer: 'ขับเคลื่อนโดย Gemini API',
    langToggle: 'EN',
    currency: {
      unit: 'บาท',
    },
  }
};
