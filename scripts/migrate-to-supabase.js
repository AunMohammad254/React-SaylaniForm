import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

async function upsertLookups() {
  const cities = JSON.parse(process.env.CITIES_JSON || '[]')
  const courses = JSON.parse(process.env.COURSES_JSON || '[]')
  if (cities.length) await supabase.from('cities').upsert(cities, { onConflict: 'name' })
  if (courses.length) await supabase.from('courses').upsert(courses, { onConflict: 'name' })
}

async function upsertStudents() {
  const path = process.env.STUDENTS_JSON_PATH
  if (!path) return
  const raw = readFileSync(path, 'utf-8')
  const items = JSON.parse(raw)
  for (const s of items) {
    const payload = {
      full_name: s.full_name,
      father_name: s.father_name,
      email: s.email,
      phone: s.phone,
      cnic: s.cnic,
      father_cnic: s.father_cnic || null,
      dob: s.dob,
      gender: s.gender,
      address: s.address || null,
      country: s.country,
      picture_url: s.picture_url || null,
      student_code: s.student_code || null,
    }
    const { error } = await supabase.from('students').upsert(payload, { onConflict: 'cnic' })
    if (error) console.error('students upsert error', s.cnic, error.message)
  }
}

async function insertRegistrations() {
  const path = process.env.REGISTRATIONS_JSON_PATH
  if (!path) return
  const raw = readFileSync(path, 'utf-8')
  const items = JSON.parse(raw)
  for (const r of items) {
    const { data: studentRows } = await supabase.from('students').select('id').eq('cnic', r.cnic).limit(1)
    const { data: courseRows } = await supabase.from('courses').select('id').eq('name', r.course).limit(1)
    const { data: cityRows } = await supabase.from('cities').select('id').eq('name', r.city).limit(1)
    const student_id = studentRows?.[0]?.id
    const course_id = courseRows?.[0]?.id
    const city_id = cityRows?.[0]?.id
    if (!student_id || !course_id || !city_id) {
      console.error('registrations fk missing', r)
      continue
    }
    const payload = {
      student_id,
      course_id,
      city_id,
      class_preference: r.class_preference,
      computer_proficiency: r.computer_proficiency || null,
      has_laptop: !!r.has_laptop,
      last_qualification: r.last_qualification || null,
      status: r.status || 'pending'
    }
    const { error } = await supabase.from('registrations').insert(payload)
    if (error) console.error('registrations insert error', r.cnic, error.message)
  }
}

async function insertResults() {
  const path = process.env.RESULTS_JSON_PATH
  if (!path) return
  const raw = readFileSync(path, 'utf-8')
  const items = JSON.parse(raw)
  for (const r of items) {
    const { data: studentRows } = await supabase.from('students').select('id').eq('cnic', r.cnic).limit(1)
    const { data: courseRows } = await supabase.from('courses').select('id').eq('name', r.course).limit(1)
    const { data: batchRows } = await supabase.from('batches').select('id').eq('number', r.batch).limit(1)
    const student_id = studentRows?.[0]?.id
    const course_id = courseRows?.[0]?.id
    const batch_id = batchRows?.[0]?.id || null
    if (!student_id || !course_id) {
      console.error('results fk missing', r)
      continue
    }
    const payload = {
      student_id,
      course_id,
      batch_id,
      score: r.score || null,
      grade: r.grade || null,
      status: r.status || null
    }
    const { error } = await supabase.from('results').insert(payload)
    if (error) console.error('results insert error', r.cnic, error.message)
  }
}

async function main() {
  await upsertLookups()
  await upsertStudents()
  await insertRegistrations()
  await insertResults()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})