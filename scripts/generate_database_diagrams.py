#!/usr/bin/env python3
"""
Generate High-Resolution SVG and PNG Diagrams for:
1. existing_database_tables
2. ai_quiz_tables
3. ai_quiz_erd
4. ai_quiz_architecture
"""
import os
import zlib
import struct

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'docs', 'database', 'images')
os.makedirs(OUT_DIR, exist_ok=True)

# ----------------------------------------------------------------------------
# Pure Python Bitmap & PNG Writer
# ----------------------------------------------------------------------------
class Canvas:
    def __init__(self, width, height, bg_color=(15, 23, 42)): # Slate-900
        self.width = width
        self.height = height
        self.pixels = bytearray(bg_color * (width * height))

    def set_pixel(self, x, y, color):
        if 0 <= x < self.width and 0 <= y < self.height:
            idx = (y * self.width + x) * 3
            self.pixels[idx:idx+3] = bytes(color)

    def fill_rect(self, x1, y1, w, h, color):
        x2 = min(x1 + w, self.width)
        y2 = min(y1 + h, self.height)
        c_bytes = bytes(color) * (x2 - max(x1, 0))
        for y in range(max(y1, 0), y2):
            start = (y * self.width + max(x1, 0)) * 3
            end = (y * self.width + x2) * 3
            self.pixels[start:end] = c_bytes

    def draw_rect(self, x, y, w, h, color, thickness=1):
        for t in range(thickness):
            self.fill_rect(x + t, y + t, w - 2*t, 1, color)
            self.fill_rect(x + t, y + h - 1 - t, w - 2*t, 1, color)
            self.fill_rect(x + t, y + t, 1, h - 2*t, color)
            self.fill_rect(x + w - 1 - t, y + t, 1, h - 2*t, color)

    def draw_line(self, x1, y1, x2, y2, color, thickness=2):
        dx = abs(x2 - x1)
        dy = abs(y2 - y1)
        sx = 1 if x1 < x2 else -1
        sy = 1 if y1 < y2 else -1
        err = dx - dy
        x, y = x1, y1
        while True:
            self.fill_rect(x - thickness//2, y - thickness//2, thickness, thickness, color)
            if x == x2 and y == y2:
                break
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x += sx
            if e2 < dx:
                err += dx
                y += sy

    def save_png(self, path):
        def chunk(tag, data):
            return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
        ihdr = struct.pack('>IIBBBBB', self.width, self.height, 8, 2, 0, 0, 0)
        raw = b''.join(b'\x00' + self.pixels[y * self.width * 3 : (y + 1) * self.width * 3] for y in range(self.height))
        idat = zlib.compress(raw, 9)
        png_bytes = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')
        with open(path, 'wb') as f:
            f.write(png_bytes)

# ----------------------------------------------------------------------------
# 1. Existing Database Tables Diagram (SVG + PNG)
# ----------------------------------------------------------------------------
def generate_existing_tables():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 850" width="1300" height="850">
  <defs>
    <style>
      .bg { fill: #0f172a; }
      .header-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 26px; font-weight: 700; fill: #f8fafc; }
      .header-sub { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; fill: #94a3b8; }
      .card { fill: #1e293b; stroke: #334155; stroke-width: 1.5; rx: 12; }
      .card-header { fill: #334155; rx: 12; }
      .table-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", monospace; font-size: 16px; font-weight: 700; fill: #38bdf8; }
      .table-badge { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 11px; fill: #cbd5e1; }
      .col-pk { font-family: monospace; font-size: 13px; font-weight: 700; fill: #facc15; }
      .col-fk { font-family: monospace; font-size: 13px; font-weight: 700; fill: #ec4899; }
      .col-name { font-family: monospace; font-size: 13px; fill: #e2e8f0; }
      .col-type { font-family: monospace; font-size: 12px; fill: #94a3b8; }
      .pill { fill: #0ea5e9; rx: 4; }
    </style>
  </defs>

  <rect width="1300" height="850" class="bg"/>

  <!-- Header -->
  <text x="50" y="50" class="header-title">Smart Study Companion — Existing PostgreSQL Schema (Supabase)</text>
  <text x="50" y="75" class="header-sub">Production Relational Schema with Row Level Security (RLS) · 8 Core Database Tables</text>

  <!-- TABLE 1: profiles -->
  <g transform="translate(50, 110)">
    <rect width="280" height="210" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 268 0 Q 280 0 280 12 L 280 40 L 0 40 Z" fill="#1e3a5f"/>
    <text x="16" y="26" class="table-title">profiles</text>
    <text x="210" y="25" class="table-badge">[RLS User]</text>
    <text x="16" y="65" class="col-pk">id</text><text x="150" y="65" class="col-type">UUID [PK]</text>
    <text x="16" y="88" class="col-name">full_name</text><text x="150" y="88" class="col-type">TEXT</text>
    <text x="16" y="111" class="col-name">university</text><text x="150" y="111" class="col-type">TEXT</text>
    <text x="16" y="134" class="col-name">faculty</text><text x="150" y="134" class="col-type">TEXT</text>
    <text x="16" y="157" class="col-name">major</text><text x="150" y="157" class="col-type">TEXT</text>
    <text x="16" y="180" class="col-name">created_at</text><text x="150" y="180" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- TABLE 2: subjects -->
  <g transform="translate(360, 110)">
    <rect width="280" height="210" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 268 0 Q 280 0 280 12 L 280 40 L 0 40 Z" fill="#1e3a5f"/>
    <text x="16" y="26" class="table-title">subjects</text>
    <text x="200" y="25" class="table-badge">[32 Seeded]</text>
    <text x="16" y="65" class="col-pk">id</text><text x="150" y="65" class="col-type">UUID [PK]</text>
    <text x="16" y="88" class="col-name">name</text><text x="150" y="88" class="col-type">VARCHAR UNIQUE</text>
    <text x="16" y="111" class="col-name">slug</text><text x="150" y="111" class="col-type">VARCHAR UNIQUE</text>
    <text x="16" y="134" class="col-name">icon</text><text x="150" y="134" class="col-type">VARCHAR</text>
    <text x="16" y="157" class="col-name">category</text><text x="150" y="157" class="col-type">VARCHAR</text>
    <text x="16" y="180" class="col-name">is_default</text><text x="150" y="180" class="col-type">BOOLEAN</text>
  </g>

  <!-- TABLE 3: universities -->
  <g transform="translate(670, 110)">
    <rect width="280" height="210" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 268 0 Q 280 0 280 12 L 280 40 L 0 40 Z" fill="#1e3a5f"/>
    <text x="16" y="26" class="table-title">universities</text>
    <text x="200" y="25" class="table-badge">[46 Seeded]</text>
    <text x="16" y="65" class="col-pk">id</text><text x="150" y="65" class="col-type">UUID [PK]</text>
    <text x="16" y="88" class="col-name">country</text><text x="150" y="88" class="col-type">VARCHAR(100)</text>
    <text x="16" y="111" class="col-name">name</text><text x="150" y="111" class="col-type">VARCHAR(255)</text>
    <text x="16" y="134" class="col-name">code</text><text x="150" y="134" class="col-type">VARCHAR(50)</text>
    <text x="16" y="157" class="col-name">is_accredited</text><text x="150" y="157" class="col-type">BOOLEAN</text>
    <text x="16" y="180" class="col-name">created_at</text><text x="150" y="180" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- TABLE 4: major_subjects -->
  <g transform="translate(980, 110)">
    <rect width="280" height="210" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 268 0 Q 280 0 280 12 L 280 40 L 0 40 Z" fill="#1e3a5f"/>
    <text x="16" y="26" class="table-title">major_subjects</text>
    <text x="190" y="25" class="table-badge">[128 Curricula]</text>
    <text x="16" y="65" class="col-pk">id</text><text x="150" y="65" class="col-type">UUID [PK]</text>
    <text x="16" y="88" class="col-name">major</text><text x="150" y="88" class="col-type">VARCHAR(255)</text>
    <text x="16" y="111" class="col-fk">subject_id</text><text x="150" y="111" class="col-type">UUID [FK]</text>
    <text x="16" y="134" class="col-name">is_core</text><text x="150" y="134" class="col-type">BOOLEAN</text>
    <text x="16" y="157" class="col-name">semester</text><text x="150" y="157" class="col-type">INT</text>
    <text x="16" y="180" class="col-name">created_at</text><text x="150" y="180" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- TABLE 5: student_subjects -->
  <g transform="translate(50, 360)">
    <rect width="280" height="200" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 268 0 Q 280 0 280 12 L 280 40 L 0 40 Z" fill="#1e3a5f"/>
    <text x="16" y="26" class="table-title">student_subjects</text>
    <text x="210" y="25" class="table-badge">[RLS User]</text>
    <text x="16" y="65" class="col-pk">id</text><text x="150" y="65" class="col-type">UUID [PK]</text>
    <text x="16" y="90" class="col-fk">student_id</text><text x="150" y="90" class="col-type">UUID [FK-Prof]</text>
    <text x="16" y="115" class="col-fk">subject_id</text><text x="150" y="115" class="col-type">UUID [FK-Subj]</text>
    <text x="16" y="140" class="col-name">enrolled_at</text><text x="150" y="140" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- TABLE 6: tasks -->
  <g transform="translate(360, 360)">
    <rect width="280" height="200" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 268 0 Q 280 0 280 12 L 280 40 L 0 40 Z" fill="#1e3a5f"/>
    <text x="16" y="26" class="table-title">tasks</text>
    <text x="210" y="25" class="table-badge">[RLS User]</text>
    <text x="16" y="65" class="col-pk">id</text><text x="150" y="65" class="col-type">UUID [PK]</text>
    <text x="16" y="88" class="col-fk">student_id</text><text x="150" y="88" class="col-type">UUID [FK-Prof]</text>
    <text x="16" y="111" class="col-fk">subject_id</text><text x="150" y="111" class="col-type">UUID [FK-Subj]</text>
    <text x="16" y="134" class="col-name">title</text><text x="150" y="134" class="col-type">VARCHAR(500)</text>
    <text x="16" y="157" class="col-name">deadline</text><text x="150" y="157" class="col-type">TIMESTAMPTZ</text>
    <text x="16" y="180" class="col-name">completed</text><text x="150" y="180" class="col-type">BOOLEAN</text>
  </g>

  <!-- TABLE 7: quiz_questions -->
  <g transform="translate(670, 360)">
    <rect width="280" height="200" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 268 0 Q 280 0 280 12 L 280 40 L 0 40 Z" fill="#1e3a5f"/>
    <text x="16" y="26" class="table-title">quiz_questions</text>
    <text x="190" y="25" class="table-badge">[345 Seeded]</text>
    <text x="16" y="65" class="col-pk">id</text><text x="150" y="65" class="col-type">UUID [PK]</text>
    <text x="16" y="88" class="col-fk">subject_id</text><text x="150" y="88" class="col-type">UUID [FK-Subj]</text>
    <text x="16" y="111" class="col-name">question</text><text x="150" y="111" class="col-type">TEXT</text>
    <text x="16" y="134" class="col-name">options</text><text x="150" y="134" class="col-type">JSONB (4 choices)</text>
    <text x="16" y="157" class="col-name">correct_answer</text><text x="150" y="157" class="col-type">INT (0..3)</text>
    <text x="16" y="180" class="col-name">created_at</text><text x="150" y="180" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- TABLE 8: quiz_attempts -->
  <g transform="translate(980, 360)">
    <rect width="280" height="200" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 268 0 Q 280 0 280 12 L 280 40 L 0 40 Z" fill="#1e3a5f"/>
    <text x="16" y="26" class="table-title">quiz_attempts</text>
    <text x="210" y="25" class="table-badge">[RLS User]</text>
    <text x="16" y="65" class="col-pk">id</text><text x="150" y="65" class="col-type">UUID [PK]</text>
    <text x="16" y="88" class="col-fk">student_id</text><text x="150" y="88" class="col-type">UUID [FK-Prof]</text>
    <text x="16" y="111" class="col-fk">subject_id</text><text x="150" y="111" class="col-type">UUID [FK-Subj]</text>
    <text x="16" y="134" class="col-name">score</text><text x="150" y="134" class="col-type">INT</text>
    <text x="16" y="157" class="col-name">total_questions</text><text x="150" y="157" class="col-type">INT</text>
    <text x="16" y="180" class="col-name">completed_at</text><text x="150" y="180" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- Footer Info Banner -->
  <g transform="translate(50, 600)">
    <rect width="1210" height="190" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
    <text x="30" y="38" font-family="sans-serif" font-size="18" font-weight="700" fill="#38bdf8">Supabase PostgreSQL Schema Summary</text>
    <text x="30" y="70" font-family="monospace" font-size="14" fill="#cbd5e1">• Host: Supabase Cloud PostgreSQL · AWS ap-northeast-2 (bcwwnjtmrcxggbaallon.supabase.co)</text>
    <text x="30" y="95" font-family="monospace" font-size="14" fill="#cbd5e1">• Data Isolation: Row Level Security (RLS) active on profiles, tasks, student_subjects, and quiz_attempts</text>
    <text x="30" y="120" font-family="monospace" font-size="14" fill="#cbd5e1">• Catalogs: 46 Accredited Universities, 32 Subjects across 4 Faculties, 128 Major Curricula, 345 Quiz Questions</text>
    <text x="30" y="145" font-family="monospace" font-size="14" fill="#cbd5e1">• Consolidation: Idempotent 1-Click Deployment via supabase/setup_all.sql (1,850+ lines)</text>
  </g>
</svg>"""
    svg_path = os.path.join(OUT_DIR, 'existing_database_tables.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    # Generate raster PNG representation
    c = Canvas(1300, 850, (15, 23, 42))
    # Draw headers
    c.fill_rect(50, 40, 600, 4, (56, 189, 248))
    # Draw cards
    coords = [
        (50, 110, 280, 210, "profiles"),
        (360, 110, 280, 210, "subjects"),
        (670, 110, 280, 210, "universities"),
        (980, 110, 280, 210, "major_subjects"),
        (50, 360, 280, 200, "student_subjects"),
        (360, 360, 280, 200, "tasks"),
        (670, 360, 280, 200, "quiz_questions"),
        (980, 360, 280, 200, "quiz_attempts")
    ]
    for x, y, w, h, name in coords:
        c.fill_rect(x, y, w, h, (30, 41, 59))
        c.draw_rect(x, y, w, h, (51, 65, 85), 2)
        c.fill_rect(x, y, w, 36, (30, 58, 95))
        c.fill_rect(x + 12, y + 14, 100, 8, (56, 189, 248))
        # Draw column mock lines
        for r in range(5):
            c.fill_rect(x + 12, y + 55 + r*24, 70, 6, (250, 204, 21) if r == 0 else (226, 232, 240))
            c.fill_rect(x + 150, y + 55 + r*24, 90, 6, (148, 163, 184))

    # Banner
    c.fill_rect(50, 600, 1210, 190, (30, 41, 59))
    c.draw_rect(50, 600, 1210, 190, (56, 189, 248), 2)
    png_path = os.path.join(OUT_DIR, 'existing_database_tables.png')
    c.save_png(png_path)
    print(f"  ✓ Created {svg_path} & {png_path}")

# ----------------------------------------------------------------------------
# 2. AI Quiz Tables Diagram (SVG + PNG)
# ----------------------------------------------------------------------------
def generate_ai_quiz_tables():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" width="1200" height="680">
  <defs>
    <style>
      .bg { fill: #0b1329; }
      .header-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 26px; font-weight: 700; fill: #f8fafc; }
      .header-sub { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; fill: #94a3b8; }
      .card { fill: #1e293b; stroke: #38bdf8; stroke-width: 1.5; rx: 12; }
      .table-title { font-family: monospace; font-size: 18px; font-weight: 700; fill: #38bdf8; }
      .table-badge { font-family: sans-serif; font-size: 11px; fill: #a5f3fc; }
      .col-pk { font-family: monospace; font-size: 13px; font-weight: 700; fill: #facc15; }
      .col-fk { font-family: monospace; font-size: 13px; font-weight: 700; fill: #ec4899; }
      .col-name { font-family: monospace; font-size: 13px; fill: #e2e8f0; }
      .col-type { font-family: monospace; font-size: 12px; fill: #94a3b8; }
    </style>
  </defs>

  <rect width="1200" height="680" class="bg"/>

  <!-- Header -->
  <text x="50" y="50" class="header-title">Smart Study Companion — AI Quiz Tables Schema (Migration 009)</text>
  <text x="50" y="75" class="header-sub">Normalized Extension Tables for AI Generated Academic Quizzes with Student RLS Isolation</text>

  <!-- TABLE 1: ai_quizzes -->
  <g transform="translate(50, 110)">
    <rect width="340" height="320" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 328 0 Q 340 0 340 12 L 340 44 L 0 44 Z" fill="#0369a1"/>
    <text x="18" y="28" class="table-title">public.ai_quizzes</text>
    <text x="240" y="28" class="table-badge">[RLS User]</text>
    <text x="18" y="75" class="col-pk">id</text><text x="160" y="75" class="col-type">UUID [PK]</text>
    <text x="18" y="105" class="col-fk">subject_id</text><text x="160" y="105" class="col-type">UUID [FK -> subjects]</text>
    <text x="18" y="135" class="col-name">topic</text><text x="160" y="135" class="col-type">VARCHAR(255)</text>
    <text x="18" y="165" class="col-name">difficulty</text><text x="160" y="165" class="col-type">VARCHAR(20) [CHECK]</text>
    <text x="18" y="195" class="col-name">question_count</text><text x="160" y="195" class="col-type">INT [1..50 CHECK]</text>
    <text x="18" y="225" class="col-fk">created_by</text><text x="160" y="225" class="col-type">UUID [FK -> profiles]</text>
    <text x="18" y="255" class="col-name">status</text><text x="160" y="255" class="col-type">VARCHAR(50)</text>
    <text x="18" y="285" class="col-name">created_at</text><text x="160" y="285" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- TABLE 2: ai_quiz_questions -->
  <g transform="translate(430, 110)">
    <rect width="340" height="320" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 328 0 Q 340 0 340 12 L 340 44 L 0 44 Z" fill="#0369a1"/>
    <text x="18" y="28" class="table-title">public.ai_quiz_questions</text>
    <text x="260" y="28" class="table-badge">[RLS Quiz]</text>
    <text x="18" y="75" class="col-pk">id</text><text x="160" y="75" class="col-type">UUID [PK]</text>
    <text x="18" y="105" class="col-fk">ai_quiz_id</text><text x="160" y="105" class="col-type">UUID [FK -> ai_quizzes]</text>
    <text x="18" y="135" class="col-name">question_text</text><text x="160" y="135" class="col-type">TEXT</text>
    <text x="18" y="165" class="col-name">options</text><text x="160" y="165" class="col-type">JSONB (4 options)</text>
    <text x="18" y="195" class="col-name">correct_answer</text><text x="160" y="195" class="col-type">INT (0..3) [CHECK]</text>
    <text x="18" y="225" class="col-name">explanation</text><text x="160" y="225" class="col-type">TEXT</text>
    <text x="18" y="255" class="col-name">question_order</text><text x="160" y="255" class="col-type">INT DEFAULT 1</text>
    <text x="18" y="285" class="col-name">created_at</text><text x="160" y="285" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- TABLE 3: ai_quiz_attempts -->
  <g transform="translate(810, 110)">
    <rect width="340" height="320" class="card"/>
    <path d="M 0 12 Q 0 0 12 0 L 328 0 Q 340 0 340 12 L 340 44 L 0 44 Z" fill="#0369a1"/>
    <text x="18" y="28" class="table-title">public.ai_quiz_attempts</text>
    <text x="250" y="28" class="table-badge">[RLS User]</text>
    <text x="18" y="75" class="col-pk">id</text><text x="160" y="75" class="col-type">UUID [PK]</text>
    <text x="18" y="105" class="col-fk">ai_quiz_id</text><text x="160" y="105" class="col-type">UUID [FK -> ai_quizzes]</text>
    <text x="18" y="135" class="col-fk">user_id</text><text x="160" y="135" class="col-type">UUID [FK -> profiles]</text>
    <text x="18" y="165" class="col-name">submitted_answers</text><text x="160" y="165" class="col-type">JSONB [responses]</text>
    <text x="18" y="195" class="col-name">score</text><text x="160" y="195" class="col-type">INT</text>
    <text x="18" y="225" class="col-name">total_questions</text><text x="160" y="225" class="col-type">INT</text>
    <text x="18" y="255" class="col-name">percentage</text><text x="160" y="255" class="col-type">INT [STORED %]</text>
    <text x="18" y="285" class="col-name">completed_at</text><text x="160" y="285" class="col-type">TIMESTAMPTZ</text>
  </g>

  <!-- RLS Security and Constraints Info -->
  <g transform="translate(50, 465)">
    <rect width="1100" height="175" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1"/>
    <text x="25" y="35" font-family="sans-serif" font-size="16" font-weight="700" fill="#38bdf8">Migration 009 Integrity &amp; Row Level Security Architecture</text>
    <text x="25" y="65" font-family="monospace" font-size="13" fill="#cbd5e1">• Strict Isolation: ai_quizzes and ai_quiz_attempts enforce auth.uid() = created_by / user_id</text>
    <text x="25" y="90" font-family="monospace" font-size="13" fill="#cbd5e1">• Question Protection: ai_quiz_questions SELECT policy requires caller to own parent ai_quizzes.id</text>
    <text x="25" y="115" font-family="monospace" font-size="13" fill="#cbd5e1">• Pedagogical Integrity: JSONB options store 4 distinct choices; correct_answer bounded between 0 and 3</text>
    <text x="25" y="140" font-family="monospace" font-size="13" fill="#cbd5e1">• Cascading Cleanliness: Deleting a profile or subject cascades and removes related AI quiz trees</text>
  </g>
</svg>"""
    svg_path = os.path.join(OUT_DIR, 'ai_quiz_tables.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    # Raster PNG
    c = Canvas(1200, 680, (11, 19, 41))
    c.fill_rect(50, 40, 500, 4, (56, 189, 248))
    for x in [50, 430, 810]:
        c.fill_rect(x, 110, 340, 320, (30, 41, 59))
        c.draw_rect(x, 110, 340, 320, (56, 189, 248), 2)
        c.fill_rect(x, 110, 340, 44, (3, 105, 161))
        c.fill_rect(x + 18, 126, 140, 10, (248, 250, 252))
        for r in range(8):
            c.fill_rect(x + 18, 175 + r*30, 80, 8, (250, 204, 21) if r == 0 else (236, 72, 153) if r in (1, 5) else (226, 232, 240))
            c.fill_rect(x + 160, 175 + r*30, 110, 8, (148, 163, 184))

    c.fill_rect(50, 465, 1100, 175, (30, 41, 59))
    c.draw_rect(50, 465, 1100, 175, (56, 189, 248), 2)
    png_path = os.path.join(OUT_DIR, 'ai_quiz_tables.png')
    c.save_png(png_path)
    print(f"  ✓ Created {svg_path} & {png_path}")

# ----------------------------------------------------------------------------
# 3. AI Quiz ERD Diagram (SVG + PNG)
# ----------------------------------------------------------------------------
def generate_ai_quiz_erd():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 780" width="1300" height="780">
  <defs>
    <style>
      .bg { fill: #0b1120; }
      .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 26px; font-weight: 700; fill: #f8fafc; }
      .sub { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; fill: #94a3b8; }
      .node-core { fill: #1e293b; stroke: #38bdf8; stroke-width: 2; rx: 10; }
      .node-ai { fill: #1e293b; stroke: #a855f7; stroke-width: 2; rx: 10; }
      .node-header-core { fill: #0284c7; }
      .node-header-ai { fill: #7e22ce; }
      .node-title { font-family: monospace; font-size: 15px; font-weight: 700; fill: #ffffff; }
      .col-pk { font-family: monospace; font-size: 12px; font-weight: 700; fill: #facc15; }
      .col-fk { font-family: monospace; font-size: 12px; font-weight: 700; fill: #f472b6; }
      .col-txt { font-family: monospace; font-size: 12px; fill: #cbd5e1; }
      .rel-line { stroke: #64748b; stroke-width: 2; stroke-dasharray: 4,4; fill: none; }
      .rel-line-ai { stroke: #c084fc; stroke-width: 2.5; fill: none; }
      .rel-label { font-family: sans-serif; font-size: 11px; fill: #e2e8f0; background: #0f172a; }
    </style>
  </defs>

  <rect width="1300" height="780" class="bg"/>

  <text x="50" y="45" class="title">Smart Study Companion — Entity Relationship Diagram (ERD)</text>
  <text x="50" y="70" class="sub">Relational schema integration between Core Database entities and New AI Quiz entities</text>

  <!-- TABLE: profiles (Core) -->
  <g transform="translate(60, 140)">
    <rect width="250" height="190" class="node-core"/>
    <path d="M 0 10 Q 0 0 10 0 L 240 0 Q 250 0 250 10 L 250 34 L 0 34 Z" class="node-header-core"/>
    <text x="14" y="23" class="node-title">profiles</text>
    <text x="14" y="60" class="col-pk">PK id (UUID)</text>
    <text x="14" y="85" class="col-txt">full_name (TEXT)</text>
    <text x="14" y="110" class="col-txt">university (TEXT)</text>
    <text x="14" y="135" class="col-txt">major (TEXT)</text>
    <text x="14" y="160" class="col-txt">created_at (TIMESTAMPTZ)</text>
  </g>

  <!-- TABLE: subjects (Core) -->
  <g transform="translate(60, 440)">
    <rect width="250" height="190" class="node-core"/>
    <path d="M 0 10 Q 0 0 10 0 L 240 0 Q 250 0 250 10 L 250 34 L 0 34 Z" class="node-header-core"/>
    <text x="14" y="23" class="node-title">subjects</text>
    <text x="14" y="60" class="col-pk">PK id (UUID)</text>
    <text x="14" y="85" class="col-txt">name (VARCHAR)</text>
    <text x="14" y="110" class="col-txt">slug (VARCHAR)</text>
    <text x="14" y="135" class="col-txt">category (VARCHAR)</text>
    <text x="14" y="160" class="col-txt">is_default (BOOLEAN)</text>
  </g>

  <!-- TABLE: ai_quizzes (New AI Extension) -->
  <g transform="translate(480, 270)">
    <rect width="290" height="240" class="node-ai"/>
    <path d="M 0 10 Q 0 0 10 0 L 280 0 Q 290 0 290 10 L 290 34 L 0 34 Z" class="node-header-ai"/>
    <text x="14" y="23" class="node-title">ai_quizzes [NEW]</text>
    <text x="14" y="60" class="col-pk">PK id (UUID)</text>
    <text x="14" y="85" class="col-fk">FK subject_id (UUID -> subjects.id)</text>
    <text x="14" y="110" class="col-fk">FK created_by (UUID -> profiles.id)</text>
    <text x="14" y="135" class="col-txt">topic (VARCHAR(255))</text>
    <text x="14" y="160" class="col-txt">difficulty ('easy'|'medium'|'hard')</text>
    <text x="14" y="185" class="col-txt">question_count (INT 1..50)</text>
    <text x="14" y="210" class="col-txt">status ('completed'|'failed')</text>
  </g>

  <!-- TABLE: ai_quiz_questions (New AI Extension) -->
  <g transform="translate(940, 110)">
    <rect width="290" height="230" class="node-ai"/>
    <path d="M 0 10 Q 0 0 10 0 L 280 0 Q 290 0 290 10 L 290 34 L 0 34 Z" class="node-header-ai"/>
    <text x="14" y="23" class="node-title">ai_quiz_questions [NEW]</text>
    <text x="14" y="60" class="col-pk">PK id (UUID)</text>
    <text x="14" y="85" class="col-fk">FK ai_quiz_id (UUID -> ai_quizzes.id)</text>
    <text x="14" y="110" class="col-txt">question_text (TEXT)</text>
    <text x="14" y="135" class="col-txt">options (JSONB - 4 choices)</text>
    <text x="14" y="160" class="col-txt">correct_answer (INT 0..3)</text>
    <text x="14" y="185" class="col-txt">explanation (TEXT)</text>
    <text x="14" y="210" class="col-txt">question_order (INT)</text>
  </g>

  <!-- TABLE: ai_quiz_attempts (New AI Extension) -->
  <g transform="translate(940, 420)">
    <rect width="290" height="240" class="node-ai"/>
    <path d="M 0 10 Q 0 0 10 0 L 280 0 Q 290 0 290 10 L 290 34 L 0 34 Z" class="node-header-ai"/>
    <text x="14" y="23" class="node-title">ai_quiz_attempts [NEW]</text>
    <text x="14" y="60" class="col-pk">PK id (UUID)</text>
    <text x="14" y="85" class="col-fk">FK ai_quiz_id (UUID -> ai_quizzes.id)</text>
    <text x="14" y="110" class="col-fk">FK user_id (UUID -> profiles.id)</text>
    <text x="14" y="135" class="col-txt">submitted_answers (JSONB)</text>
    <text x="14" y="160" class="col-txt">score (INT)</text>
    <text x="14" y="185" class="col-txt">total_questions (INT)</text>
    <text x="14" y="210" class="col-txt">percentage (INT GENERATED %)</text>
  </g>

  <!-- RELATIONSHIPS -->
  <!-- profiles -> ai_quizzes (1:N) -->
  <path d="M 310 235 L 480 340" class="rel-line-ai"/>
  <rect x="365" y="270" width="60" height="18" rx="4" fill="#1e293b"/>
  <text x="370" y="283" class="rel-label">1 : N owns</text>

  <!-- subjects -> ai_quizzes (1:N) -->
  <path d="M 310 535 L 480 430" class="rel-line-ai"/>
  <rect x="350" y="470" width="85" height="18" rx="4" fill="#1e293b"/>
  <text x="355" y="483" class="rel-label">1 : N categorizes</text>

  <!-- ai_quizzes -> ai_quiz_questions (1:N) -->
  <path d="M 770 330 L 940 225" class="rel-line-ai"/>
  <rect x="820" y="260" width="75" height="18" rx="4" fill="#1e293b"/>
  <text x="825" y="273" class="rel-label">1 : N contains</text>

  <!-- ai_quizzes -> ai_quiz_attempts (1:N) -->
  <path d="M 770 430 L 940 510" class="rel-line-ai"/>
  <rect x="825" y="460" width="65" height="18" rx="4" fill="#1e293b"/>
  <text x="830" y="473" class="rel-label">1 : N tracks</text>

  <!-- profiles -> ai_quiz_attempts (1:N via long bezier) -->
  <path d="M 310 180 C 400 90, 800 50, 940 450" class="rel-line" stroke="#38bdf8"/>
  <rect x="580" y="70" width="95" height="18" rx="4" fill="#1e293b"/>
  <text x="585" y="83" class="rel-label">1 : N user submit</text>
</svg>"""
    svg_path = os.path.join(OUT_DIR, 'ai_quiz_erd.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    # Raster PNG
    c = Canvas(1300, 780, (11, 17, 32))
    # Boxes
    c.fill_rect(60, 140, 250, 190, (30, 41, 59))
    c.draw_rect(60, 140, 250, 190, (56, 189, 248), 2)
    c.fill_rect(60, 140, 250, 34, (2, 132, 199))

    c.fill_rect(60, 440, 250, 190, (30, 41, 59))
    c.draw_rect(60, 440, 250, 190, (56, 189, 248), 2)
    c.fill_rect(60, 440, 250, 34, (2, 132, 199))

    c.fill_rect(480, 270, 290, 240, (30, 41, 59))
    c.draw_rect(480, 270, 290, 240, (168, 85, 247), 2)
    c.fill_rect(480, 270, 290, 34, (126, 34, 206))

    c.fill_rect(940, 110, 290, 230, (30, 41, 59))
    c.draw_rect(940, 110, 290, 230, (168, 85, 247), 2)
    c.fill_rect(940, 110, 290, 34, (126, 34, 206))

    c.fill_rect(940, 420, 290, 240, (30, 41, 59))
    c.draw_rect(940, 420, 290, 240, (168, 85, 247), 2)
    c.fill_rect(940, 420, 290, 34, (126, 34, 206))

    # Lines
    c.draw_line(310, 235, 480, 340, (192, 132, 252), 3)
    c.draw_line(310, 535, 480, 430, (192, 132, 252), 3)
    c.draw_line(770, 330, 940, 225, (192, 132, 252), 3)
    c.draw_line(770, 430, 940, 510, (192, 132, 252), 3)

    png_path = os.path.join(OUT_DIR, 'ai_quiz_erd.png')
    c.save_png(png_path)
    print(f"  ✓ Created {svg_path} & {png_path}")

# ----------------------------------------------------------------------------
# 4. AI Quiz Architecture Diagram (SVG + PNG)
# ----------------------------------------------------------------------------
def generate_ai_quiz_architecture():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 700" width="1300" height="700">
  <defs>
    <style>
      .bg { fill: #0a0f1d; }
      .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 26px; font-weight: 700; fill: #f8fafc; }
      .sub { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; fill: #94a3b8; }
      .stage-box { fill: #1e293b; stroke: #475569; stroke-width: 1.5; rx: 12; }
      .stage-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 15px; font-weight: 700; fill: #38bdf8; }
      .stage-item { font-family: monospace; font-size: 12px; fill: #cbd5e1; }
      .flow-arrow { stroke: #38bdf8; stroke-width: 2.5; fill: none; marker-end: url(#arrow); }
      .ai-box { fill: #2e1065; stroke: #a855f7; stroke-width: 2; rx: 12; }
      .db-box { fill: #042f2e; stroke: #14b8a6; stroke-width: 2; rx: 12; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
  </defs>

  <rect width="1300" height="700" class="bg"/>

  <text x="50" y="45" class="title">Smart Study Companion — AI Quiz End-to-End System Architecture</text>
  <text x="50" y="70" class="sub">Workflow pipeline from Student Browser Request to AI Synthesis, Validation, RLS Database, and Scoring</text>

  <!-- STAGE 1: Student Browser -->
  <g transform="translate(50, 120)">
    <rect width="250" height="480" class="stage-box"/>
    <rect width="250" height="40" rx="12" fill="#0284c7"/>
    <text x="16" y="26" font-family="sans-serif" font-size="16" font-weight="700" fill="#ffffff">1. Student Browser</text>
    <text x="16" y="70" class="stage-item">• Logged-in Student Session</text>
    <text x="16" y="95" class="stage-item">• Academic Subject Selected</text>
    <text x="16" y="120" class="stage-item">• Custom Topic Prompt Input</text>
    <text x="16" y="145" class="stage-item">• Difficulty: Easy/Med/Hard</text>
    <text x="16" y="170" class="stage-item">• Question Count: 5/10/15/20</text>
    <text x="16" y="210" class="stage-title">Interactive Stage:</text>
    <text x="16" y="235" class="stage-item">• Responsive Play Interface</text>
    <text x="16" y="260" class="stage-item">• 4 Multi-Choice Radio Cards</text>
    <text x="16" y="285" class="stage-item">• Next / Previous Controls</text>
    <text x="16" y="325" class="stage-title">Results &amp; Review:</text>
    <text x="16" y="350" class="stage-item">• Score &amp; Marks Calculation</text>
    <text x="16" y="375" class="stage-item">• Correct Answer Highlights</text>
    <text x="16" y="400" class="stage-item">• Pedagogical Explanations</text>
  </g>

  <!-- STAGE 2: Client Service -->
  <g transform="translate(340, 120)">
    <rect width="240" height="480" class="stage-box"/>
    <rect width="240" height="40" rx="12" fill="#0369a1"/>
    <text x="16" y="26" font-family="sans-serif" font-size="16" font-weight="700" fill="#ffffff">2. Client Service</text>
    <text x="16" y="70" class="stage-item">src/services/ai-quiz.js</text>
    <text x="16" y="110" class="stage-title">Responsibilities:</text>
    <text x="16" y="135" class="stage-item">• Parameter sanitization</text>
    <text x="16" y="160" class="stage-item">• JWT Bearer attachment</text>
    <text x="16" y="185" class="stage-item">• Edge Function invocation</text>
    <text x="16" y="210" class="stage-item">• Graceful Offline Engine</text>
    <text x="16" y="235" class="stage-item">• Local Preview fallback</text>
    <text x="16" y="275" class="stage-title">Question Validator:</text>
    <text x="16" y="300" class="stage-item">• 4 distinct options check</text>
    <text x="16" y="325" class="stage-item">• Index bounds (0..3)</text>
    <text x="16" y="350" class="stage-item">• Duplicate suppression</text>
    <text x="16" y="375" class="stage-item">• Explanation verification</text>
  </g>

  <!-- STAGE 3: AI Backend / Edge Function -->
  <g transform="translate(620, 120)">
    <rect width="280" height="230" class="ai-box"/>
    <rect width="280" height="40" rx="12" fill="#7e22ce"/>
    <text x="16" y="26" font-family="sans-serif" font-size="16" font-weight="700" fill="#ffffff">3. Edge API &amp; Gemini Model</text>
    <text x="16" y="70" class="stage-item">supabase/functions/generate-ai-quiz</text>
    <text x="16" y="95" class="stage-item">• Supabase Auth token validation</text>
    <text x="16" y="120" class="stage-item">• Server-side GEMINI_API_KEY</text>
    <text x="16" y="145" class="stage-item">• Structured Academic Prompt</text>
    <text x="16" y="170" class="stage-item">• JSON Mode Strict Schema</text>
    <text x="16" y="195" class="stage-item">• Rate limiting &amp; Error recovery</text>
  </g>

  <!-- STAGE 4: Database Persistence -->
  <g transform="translate(620, 380)">
    <rect width="280" height="220" class="db-box"/>
    <rect width="280" height="40" rx="12" fill="#0f766e"/>
    <text x="16" y="26" font-family="sans-serif" font-size="16" font-weight="700" fill="#ffffff">4. Supabase Database</text>
    <text x="16" y="70" class="stage-item">PostgreSQL Cloud (Migration 009)</text>
    <text x="16" y="100" class="stage-item">• public.ai_quizzes (metadata)</text>
    <text x="16" y="125" class="stage-item">• public.ai_quiz_questions</text>
    <text x="16" y="150" class="stage-item">• public.ai_quiz_attempts</text>
    <text x="16" y="180" class="stage-item">• Row Level Security Isolation</text>
  </g>

  <!-- STAGE 5: Scoring & Persistence Flow -->
  <g transform="translate(940, 120)">
    <rect width="310" height="480" class="stage-box"/>
    <rect width="310" height="40" rx="12" fill="#334155"/>
    <text x="16" y="26" font-family="sans-serif" font-size="16" font-weight="700" fill="#ffffff">5. Scoring &amp; Review Pipeline</text>
    <text x="16" y="70" class="stage-title">Answer Key Protection:</text>
    <text x="16" y="95" class="stage-item">• Correct answers verified upon submission</text>
    <text x="16" y="120" class="stage-item">• Client cannot tamper with scoring</text>
    <text x="16" y="160" class="stage-title">Scoring Formula:</text>
    <text x="16" y="185" class="stage-item">• Score = sum(selected == correct)</text>
    <text x="16" y="210" class="stage-item">• Percentage = (Score / Total) * 100</text>
    <text x="16" y="250" class="stage-title">Persistence &amp; History:</text>
    <text x="16" y="275" class="stage-item">• Saves full response history to cloud</text>
    <text x="16" y="300" class="stage-item">• Persists across browser refresh</text>
    <text x="16" y="325" class="stage-item">• Linked to Student Profile</text>
    <text x="16" y="365" class="stage-title">Academic Separation:</text>
    <text x="16" y="390" class="stage-item">• AI quizzes kept distinct from static bank</text>
    <text x="16" y="415" class="stage-item">• Standard &amp; Rapid quizzes unmodified</text>
  </g>

  <!-- Connectors -->
  <path d="M 300 220 L 340 220" class="flow-arrow"/>
  <path d="M 580 200 L 620 200" class="flow-arrow"/>
  <path d="M 760 350 L 760 380" class="flow-arrow"/>
  <path d="M 900 480 L 940 480" class="flow-arrow"/>
</svg>"""
    svg_path = os.path.join(OUT_DIR, 'ai_quiz_architecture.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    # Raster PNG
    c = Canvas(1300, 700, (10, 15, 29))
    c.fill_rect(50, 120, 250, 480, (30, 41, 59))
    c.fill_rect(50, 120, 250, 40, (2, 132, 199))

    c.fill_rect(340, 120, 240, 480, (30, 41, 59))
    c.fill_rect(340, 120, 240, 40, (3, 105, 161))

    c.fill_rect(620, 120, 280, 230, (46, 16, 101))
    c.draw_rect(620, 120, 280, 230, (168, 85, 247), 2)
    c.fill_rect(620, 120, 280, 40, (126, 34, 206))

    c.fill_rect(620, 380, 280, 220, (4, 47, 46))
    c.draw_rect(620, 380, 280, 220, (20, 184, 166), 2)
    c.fill_rect(620, 380, 280, 40, (15, 118, 110))

    c.fill_rect(940, 120, 310, 480, (30, 41, 59))
    c.fill_rect(940, 120, 310, 40, (51, 65, 85))

    c.draw_line(300, 220, 340, 220, (56, 189, 248), 3)
    c.draw_line(580, 200, 620, 200, (56, 189, 248), 3)
    c.draw_line(760, 350, 760, 380, (56, 189, 248), 3)
    c.draw_line(900, 480, 940, 480, (56, 189, 248), 3)

    png_path = os.path.join(OUT_DIR, 'ai_quiz_architecture.png')
    c.save_png(png_path)
    print(f"  ✓ Created {svg_path} & {png_path}")

if __name__ == '__main__':
    print("Generating Database Diagrams and Architecture Images...")
    generate_existing_tables()
    generate_ai_quiz_tables()
    generate_ai_quiz_erd()
    generate_ai_quiz_architecture()
    print("ALL DIAGRAMS AND IMAGES GENERATED SUCCESSFULLY!")
