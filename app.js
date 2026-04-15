// ==========================================
// SUPABASE INITIALIZATION (using your original naming)
// ==========================================
const SUPABASE_URL = 'https://dpkxpqqrmpncqhfgorpy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wIHCQAi5-fyRI9A87hEIkg_M6smk-ZU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// DYNAMIC ROW TEMPLATES (unchanged)
// ==========================================
const childTemplate = `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">X Remove</button><div class="grid-3"><div><label>First Name:</label><input type="text" name="childFirstName[]"></div><div><label>Middle Name:</label><input type="text" name="childMiddleName[]"></div><div><label>Name Ext:</label><input type="text" name="childExt[]"></div><div><label>Date of Birth:</label><input type="date" name="childDob[]"></div></div>`;

const educationTemplate = `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">X Remove</button><div class="grid-2"><div><label>Level:</label><select name="eduLevel[]"><option>Elementary</option><option>Secondary</option><option>Vocational</option><option>College</option><option>Graduate</option></select></div><div><label>School Name:</label><input type="text" name="eduSchool[]"></div></div><div><label>Degree/Course:</label><input type="text" name="eduCourse[]"></div><div class="grid-3"><div><label>Period From:</label><input type="number" name="eduFrom[]"></div><div><label>Period To:</label><input type="number" name="eduTo[]"></div><div><label>Units Earned:</label><input type="text" name="eduUnits[]"></div><div><label>Year Graduated:</label><input type="number" name="eduGradYear[]"></div><div><label>Honors:</label><input type="text" name="eduHonors[]"></div></div>`;

const eligibilityTemplate = `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">X Remove</button><div class="grid-2"><div><label>Eligibility Type:</label><input type="text" name="eligType[]"></div><div><label>Rating:</label><input type="text" name="eligRating[]"></div></div><div class="grid-2"><div><label>Date of Exam:</label><input type="date" name="eligDate[]"></div><div><label>Place of Exam:</label><input type="text" name="eligPlace[]"></div></div><div class="grid-2"><div><label>License Number:</label><input type="text" name="eligLicense[]"></div><div><label>License Valid Until:</label><input type="date" name="eligValid[]"></div></div>`;

const workTemplate = `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">X Remove</button><div class="grid-2"><div><label>Date From:</label><input type="date" name="workFrom[]"></div><div><label>Date To:</label><input type="date" name="workTo[]"></div></div><div class="grid-2"><div><label>Position Title:</label><input type="text" name="workPosition[]"></div><div><label>Company/Agency:</label><input type="text" name="workCompany[]"></div></div><div class="grid-2"><div><label>Status of Appointment:</label><input type="text" name="workStatus[]"></div><div><label>Govt Service?</label><select name="workGovt[]"><option>Yes</option><option>No</option></select></div></div>`;

const voluntaryTemplate = `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">X Remove</button><div><label>Organization Name & Address:</label><input type="text" name="volOrg[]"></div><div class="grid-3"><div><label>Date From:</label><input type="date" name="volFrom[]"></div><div><label>Date To:</label><input type="date" name="volTo[]"></div><div><label>Number of Hours:</label><input type="number" name="volHours[]"></div></div><div><label>Position/Nature of Work:</label><input type="text" name="volPosition[]"></div>`;

const trainingTemplate = `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">X Remove</button><div><label>Title of Training:</label><input type="text" name="trainTitle[]"></div><div class="grid-3"><div><label>Date From:</label><input type="date" name="trainFrom[]"></div><div><label>Date To:</label><input type="date" name="trainTo[]"></div><div><label>Number of Hours:</label><input type="number" name="trainHours[]"></div></div><div class="grid-2"><div><label>Type of LD:</label><input type="text" name="trainType[]"></div><div><label>Conducted/Sponsored By:</label><input type="text" name="trainSponsor[]"></div></div>`;

const otherInfoTemplate = `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">X Remove</button><div class="grid-2"><div><label>Category:</label><select name="otherCat[]"><option>Special Skill/Hobby</option><option>Non-Academic Distinction/Recognition</option><option>Membership in Association/Organization</option></select></div><div><label>Details:</label><input type="text" name="otherDetails[]"></div></div>`;

const referenceTemplate = `<button type="button" class="remove-btn" onclick="this.parentElement.remove()">X Remove</button><div class="grid-3"><div><label>Name:</label><input type="text" name="refName[]"></div><div><label>Address:</label><input type="text" name="refAddress[]"></div><div><label>Contact No.:</label><input type="text" name="refContact[]"></div></div>`;

// Global function to add dynamic row (used by onclick in HTML)
window.addDynamicRow = function(containerId, templateStr) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found:", containerId);
    return;
  }
  const div = document.createElement('div');
  div.className = 'dynamic-section';
  div.innerHTML = templateStr;
  container.appendChild(div);
};

// Helper to safely set form field value
function setFieldValue(form, name, value) {
  if (!form || !form.elements) return;
  const field = form.elements[name];
  if (field && value !== undefined && value !== null) {
    field.value = value;
  }
}

// ==========================================
// 1. LOAD DATA ON STARTUP
// ==========================================
async function loadUserData() {
  const loadingEl = document.getElementById('loadingStatus');
  if (loadingEl) loadingEl.style.display = 'block';
  
  try {
    // Get current user email from global variable (set in index.html via prompt)
    const userEmail = window.GLOBAL_USER_EMAIL;
    if (!userEmail) {
      console.warn("No user email found. Please log in.");
      if (loadingEl) loadingEl.style.display = 'none';
      return;
    }
    
    const { data: profile, error } = await supabaseClient
      .from('faculty_profiles')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();  // Use maybeSingle to avoid error if no row
    
    if (error) throw error;
    
    const form = document.getElementById('pdsForm');
    if (!form) return;
    
    // Clear all dynamic containers before loading (to avoid duplication)
    const dynamicContainers = ['childrenContainer', 'educationContainer', 'eligibilityContainer', 'workContainer', 'voluntaryContainer', 'trainingContainer', 'otherInfoContainer', 'referenceContainer'];
    dynamicContainers.forEach(id => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = '';
    });
    
    if (profile) {
      // ----- Populate non-dynamic fields -----
      const fieldMap = {
        'Surname': profile.surname,
        'First Name': profile.first_name,
        'Middle Name': profile.middle_name,
        'Name Extension (JR, SR)': profile.name_extension,
        'Date of Birth': profile.date_of_birth,
        'Place of Birth': profile.place_of_birth,
        'Sex at Birth': profile.sex,
        'Civil Status': profile.civil_status,
        'Height (m)': profile.height,
        'Weight (kg)': profile.weight,
        'Blood Type': profile.blood_type,
        'UMID ID NO.': profile.umid_no,
        'PAG-IBIG ID NO.': profile.pagibig_no,
        'PHILHEALTH NO.': profile.philhealth_no,
        'PhilSys Number (PSN)': profile.psn_no,
        'TIN NO.': profile.tin_no,
        'AGENCY EMPLOYEE NO.': profile.agency_emp_no,
        'Citizenship': profile.citizenship,
        'Dual Citizenship Details/Country': profile.dual_citizenship_details,
        'Res House/Block/Lot': profile.res_house,
        'Res Street': profile.res_street,
        'Res Subdivision/Village': profile.res_subdivision,
        'Res Barangay': profile.res_barangay,
        'Res City/Municipality': profile.res_city,
        'Res Province': profile.res_province,
        'Res ZIP': profile.res_zip,
        'Perm House/Block/Lot': profile.perm_house,
        'Perm Street': profile.perm_street,
        'Perm Subdivision/Village': profile.perm_subdivision,
        'Perm Barangay': profile.perm_barangay,
        'Perm City/Municipality': profile.perm_city,
        'Perm Province': profile.perm_province,
        'Perm ZIP': profile.perm_zip,
        'Telephone No.': profile.telephone_no,
        'Mobile No.': profile.mobile_no,
        'Alternative E-mail Address': profile.alt_email,
        'Spouse Surname': profile.spouse_surname,
        'Spouse First Name': profile.spouse_first_name,
        'Spouse Name Ext': profile.spouse_name_ext,
        'Spouse Middle Name': profile.spouse_middle_name,
        'Spouse Occupation': profile.spouse_occupation,
        'Spouse Employer/Business Name': profile.spouse_employer,
        'Spouse Business Address': profile.spouse_business_address,
        'Spouse Telephone No.': profile.spouse_telephone,
        'Father Surname': profile.father_surname,
        'Father First Name': profile.father_first_name,
        'Father Name Ext': profile.father_name_ext,
        'Father Middle Name': profile.father_middle_name,
        'Mother Maiden Surname': profile.mother_maiden_surname,
        'Mother First Name': profile.mother_first_name,
        'Mother Middle Name': profile.mother_middle_name,
        'Q34a Consanguinity 3rd Deg': profile.q34a_consanguinity_3rd,
        'Q34b Consanguinity 4th Deg': profile.q34b_consanguinity_4th,
        'Q35a Admin Offense': profile.q35a_admin_offense,
        'Q35a Details': profile.q35a_details,
        'Q35b Criminal Charge': profile.q35b_criminal_charge,
        'Q35b Date Filed': profile.q35b_date_filed,
        'Q35b Status': profile.q35b_status,
        'Q36 Convicted': profile.q36_convicted,
        'Q36 Details': profile.q36_details,
        'Q37 Separated from Service': profile.q37_separated,
        'Q37 Details': profile.q37_details,
        'Q38a Election Candidate': profile.q38a_candidate,
        'Q38a Details': profile.q38a_details,
        'Q38b Resigned to Campaign': profile.q38b_resigned,
        'Q38b Details': profile.q38b_details,
        'Q39 Immigrant': profile.q39_immigrant,
        'Q39 Details': profile.q39_details,
        'Q40a Indigenous': profile.q40a_indigenous,
        'Q40a Details': profile.q40a_details,
        'Q40b PWD': profile.q40b_pwd,
        'Q40b ID': profile.q40b_id,
        'Q40c Solo Parent': profile.q40c_solo_parent,
        'Q40c ID': profile.q40c_id,
        'Govt Issued ID': profile.govt_issued_id,
        'ID/License/Passport No.': profile.id_license_passport_no,
        'Date/Place of Issuance': profile.date_place_issuance
      };
      for (const [fieldName, value] of Object.entries(fieldMap)) {
        setFieldValue(form, fieldName, value);
      }
      
      // ----- Helper to load dynamic rows -----
      async function loadDynamicRows(tableName, containerId, template, fieldMapping) {
        const { data: rows, error } = await supabaseClient
          .from(tableName)
          .select('*')
          .eq('faculty_id', profile.id);
        if (error) {
          console.error(`Error loading ${tableName}:`, error);
          return;
        }
        if (rows && rows.length) {
          rows.forEach(row => {
            const rowDiv = window.addDynamicRow(containerId, template);
            for (const [htmlName, dbField] of Object.entries(fieldMapping)) {
              const input = rowDiv.querySelector(`[name="${htmlName}"]`);
              if (input && row[dbField]) {
                input.value = row[dbField];
              }
            }
          });
        }
      }
      
      // Load all dynamic sections
      await loadDynamicRows('children', 'childrenContainer', childTemplate, {
        'childFirstName[]': 'first_name',
        'childMiddleName[]': 'middle_name',
        'childExt[]': 'name_extension',
        'childDob[]': 'date_of_birth'
      });
      
      await loadDynamicRows('education', 'educationContainer', educationTemplate, {
        'eduLevel[]': 'level',
        'eduSchool[]': 'school_name',
        'eduCourse[]': 'course',
        'eduFrom[]': 'period_from',
        'eduTo[]': 'period_to',
        'eduUnits[]': 'units_earned',
        'eduGradYear[]': 'year_graduated',
        'eduHonors[]': 'honors'
      });
      
      await loadDynamicRows('eligibility', 'eligibilityContainer', eligibilityTemplate, {
        'eligType[]': 'eligibility_type',
        'eligRating[]': 'rating',
        'eligDate[]': 'date_of_exam',
        'eligPlace[]': 'place_of_exam',
        'eligLicense[]': 'license_number',
        'eligValid[]': 'license_valid_until'
      });
      
      await loadDynamicRows('work_experience', 'workContainer', workTemplate, {
        'workFrom[]': 'date_from',
        'workTo[]': 'date_to',
        'workPosition[]': 'position_title',
        'workCompany[]': 'company',
        'workStatus[]': 'status',
        'workGovt[]': 'is_govt_service'
      });
      
      await loadDynamicRows('voluntary_work', 'voluntaryContainer', voluntaryTemplate, {
        'volOrg[]': 'organization',
        'volFrom[]': 'date_from',
        'volTo[]': 'date_to',
        'volHours[]': 'hours',
        'volPosition[]': 'position'
      });
      
      await loadDynamicRows('training', 'trainingContainer', trainingTemplate, {
        'trainTitle[]': 'title',
        'trainFrom[]': 'date_from',
        'trainTo[]': 'date_to',
        'trainHours[]': 'hours',
        'trainType[]': 'type',
        'trainSponsor[]': 'sponsor'
      });
      
      await loadDynamicRows('other_info', 'otherInfoContainer', otherInfoTemplate, {
        'otherCat[]': 'category',
        'otherDetails[]': 'details'
      });
      
      await loadDynamicRows('references_table', 'referenceContainer', referenceTemplate, {
        'refName[]': 'name',
        'refAddress[]': 'address',
        'refContact[]': 'contact_no'
      });
      
    } else {
      console.log("No existing profile found for this email. New record will be created on submit.");
    }
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load saved data. Check console for details.");
  } finally {
    if (loadingEl) loadingEl.style.display = 'none';
  }
}

// ==========================================
// 2. SAVE / UPDATE DATA
// ==========================================
async function submitForm() {
  const btn = document.getElementById('submitBtn');
  const originalText = btn.innerText;
  btn.innerText = "Saving... Please wait";
  btn.disabled = true;
  
  const form = document.getElementById('pdsForm');
  const formData = new FormData(form);
  const clean = (val) => (val === "" || val === null ? null : val);
  
  try {
    const userEmail = window.GLOBAL_USER_EMAIL;
    if (!userEmail) throw new Error("No user email. Please refresh and log in.");
    
    // ----- Build profile payload (all non-dynamic fields) -----
    const profilePayload = {
      email: userEmail,
      surname: clean(formData.get('Surname')),
      first_name: clean(formData.get('First Name')),
      middle_name: clean(formData.get('Middle Name')),
      name_extension: clean(formData.get('Name Extension (JR, SR)')),
      date_of_birth: clean(formData.get('Date of Birth')),
      place_of_birth: clean(formData.get('Place of Birth')),
      sex: clean(formData.get('Sex at Birth')),
      civil_status: clean(formData.get('Civil Status')),
      height: clean(formData.get('Height (m)')),
      weight: clean(formData.get('Weight (kg)')),
      blood_type: clean(formData.get('Blood Type')),
      umid_no: clean(formData.get('UMID ID NO.')),
      pagibig_no: clean(formData.get('PAG-IBIG ID NO.')),
      philhealth_no: clean(formData.get('PHILHEALTH NO.')),
      psn_no: clean(formData.get('PhilSys Number (PSN)')),
      tin_no: clean(formData.get('TIN NO.')),
      agency_emp_no: clean(formData.get('AGENCY EMPLOYEE NO.')),
      citizenship: clean(formData.get('Citizenship')),
      dual_citizenship_details: clean(formData.get('Dual Citizenship Details/Country')),
      res_house: clean(formData.get('Res House/Block/Lot')),
      res_street: clean(formData.get('Res Street')),
      res_subdivision: clean(formData.get('Res Subdivision/Village')),
      res_barangay: clean(formData.get('Res Barangay')),
      res_city: clean(formData.get('Res City/Municipality')),
      res_province: clean(formData.get('Res Province')),
      res_zip: clean(formData.get('Res ZIP')),
      perm_house: clean(formData.get('Perm House/Block/Lot')),
      perm_street: clean(formData.get('Perm Street')),
      perm_subdivision: clean(formData.get('Perm Subdivision/Village')),
      perm_barangay: clean(formData.get('Perm Barangay')),
      perm_city: clean(formData.get('Perm City/Municipality')),
      perm_province: clean(formData.get('Perm Province')),
      perm_zip: clean(formData.get('Perm ZIP')),
      telephone_no: clean(formData.get('Telephone No.')),
      mobile_no: clean(formData.get('Mobile No.')),
      alt_email: clean(formData.get('Alternative E-mail Address')),
      spouse_surname: clean(formData.get('Spouse Surname')),
      spouse_first_name: clean(formData.get('Spouse First Name')),
      spouse_name_ext: clean(formData.get('Spouse Name Ext')),
      spouse_middle_name: clean(formData.get('Spouse Middle Name')),
      spouse_occupation: clean(formData.get('Spouse Occupation')),
      spouse_employer: clean(formData.get('Spouse Employer/Business Name')),
      spouse_business_address: clean(formData.get('Spouse Business Address')),
      spouse_telephone: clean(formData.get('Spouse Telephone No.')),
      father_surname: clean(formData.get('Father Surname')),
      father_first_name: clean(formData.get('Father First Name')),
      father_name_ext: clean(formData.get('Father Name Ext')),
      father_middle_name: clean(formData.get('Father Middle Name')),
      mother_maiden_surname: clean(formData.get('Mother Maiden Surname')),
      mother_first_name: clean(formData.get('Mother First Name')),
      mother_middle_name: clean(formData.get('Mother Middle Name')),
      q34a_consanguinity_3rd: clean(formData.get('Q34a Consanguinity 3rd Deg')),
      q34b_consanguinity_4th: clean(formData.get('Q34b Consanguinity 4th Deg')),
      q35a_admin_offense: clean(formData.get('Q35a Admin Offense')),
      q35a_details: clean(formData.get('Q35a Details')),
      q35b_criminal_charge: clean(formData.get('Q35b Criminal Charge')),
      q35b_date_filed: clean(formData.get('Q35b Date Filed')),
      q35b_status: clean(formData.get('Q35b Status')),
      q36_convicted: clean(formData.get('Q36 Convicted')),
      q36_details: clean(formData.get('Q36 Details')),
      q37_separated: clean(formData.get('Q37 Separated from Service')),
      q37_details: clean(formData.get('Q37 Details')),
      q38a_candidate: clean(formData.get('Q38a Election Candidate')),
      q38a_details: clean(formData.get('Q38a Details')),
      q38b_resigned: clean(formData.get('Q38b Resigned to Campaign')),
      q38b_details: clean(formData.get('Q38b Details')),
      q39_immigrant: clean(formData.get('Q39 Immigrant')),
      q39_details: clean(formData.get('Q39 Details')),
      q40a_indigenous: clean(formData.get('Q40a Indigenous')),
      q40a_details: clean(formData.get('Q40a Details')),
      q40b_pwd: clean(formData.get('Q40b PWD')),
      q40b_id: clean(formData.get('Q40b ID')),
      q40c_solo_parent: clean(formData.get('Q40c Solo Parent')),
      q40c_id: clean(formData.get('Q40c ID')),
      govt_issued_id: clean(formData.get('Govt Issued ID')),
      id_license_passport_no: clean(formData.get('ID/License/Passport No.')),
      date_place_issuance: clean(formData.get('Date/Place of Issuance'))
    };
    
    // Upsert profile
    const { data: profileData, error: profileError } = await supabaseClient
      .from('faculty_profiles')
      .upsert(profilePayload, { onConflict: 'email' })
      .select();
    if (profileError) throw profileError;
    const facultyId = profileData[0].id;
    
    // Helper to replace records in a dynamic table
    async function replaceDynamicTable(tableName, fieldNames, dbMapping) {
      // Delete old records
      const { error: deleteError } = await supabaseClient
        .from(tableName)
        .delete()
        .eq('faculty_id', facultyId);
      if (deleteError) throw deleteError;
      
      // Get the first field to determine number of rows
      const firstField = fieldNames[0];
      const values = formData.getAll(firstField);
      if (values.length === 0) return;
      
      const records = [];
      for (let i = 0; i < values.length; i++) {
        const record = { faculty_id: facultyId };
        let hasData = false;
        for (const field of fieldNames) {
          const fieldValue = formData.getAll(field)[i];
          const dbField = dbMapping[field];
          if (fieldValue && fieldValue.trim() !== '') {
            hasData = true;
            record[dbField] = clean(fieldValue);
          } else {
            record[dbField] = null;
          }
        }
        if (hasData) records.push(record);
      }
      
      if (records.length > 0) {
        const { error: insertError } = await supabaseClient
          .from(tableName)
          .insert(records);
        if (insertError) throw insertError;
      }
    }
    
    // Execute for each dynamic table
    await replaceDynamicTable('children',
      ['childFirstName[]', 'childMiddleName[]', 'childExt[]', 'childDob[]'],
      { 'childFirstName[]': 'first_name', 'childMiddleName[]': 'middle_name', 'childExt[]': 'name_extension', 'childDob[]': 'date_of_birth' });
    
    await replaceDynamicTable('education',
      ['eduLevel[]', 'eduSchool[]', 'eduCourse[]', 'eduFrom[]', 'eduTo[]', 'eduUnits[]', 'eduGradYear[]', 'eduHonors[]'],
      { 'eduLevel[]': 'level', 'eduSchool[]': 'school_name', 'eduCourse[]': 'course', 'eduFrom[]': 'period_from', 'eduTo[]': 'period_to', 'eduUnits[]': 'units_earned', 'eduGradYear[]': 'year_graduated', 'eduHonors[]': 'honors' });
    
    await replaceDynamicTable('eligibility',
      ['eligType[]', 'eligRating[]', 'eligDate[]', 'eligPlace[]', 'eligLicense[]', 'eligValid[]'],
      { 'eligType[]': 'eligibility_type', 'eligRating[]': 'rating', 'eligDate[]': 'date_of_exam', 'eligPlace[]': 'place_of_exam', 'eligLicense[]': 'license_number', 'eligValid[]': 'license_valid_until' });
    
    await replaceDynamicTable('work_experience',
      ['workFrom[]', 'workTo[]', 'workPosition[]', 'workCompany[]', 'workStatus[]', 'workGovt[]'],
      { 'workFrom[]': 'date_from', 'workTo[]': 'date_to', 'workPosition[]': 'position_title', 'workCompany[]': 'company', 'workStatus[]': 'status', 'workGovt[]': 'is_govt_service' });
    
    await replaceDynamicTable('voluntary_work',
      ['volOrg[]', 'volFrom[]', 'volTo[]', 'volHours[]', 'volPosition[]'],
      { 'volOrg[]': 'organization', 'volFrom[]': 'date_from', 'volTo[]': 'date_to', 'volHours[]': 'hours', 'volPosition[]': 'position' });
    
    await replaceDynamicTable('training',
      ['trainTitle[]', 'trainFrom[]', 'trainTo[]', 'trainHours[]', 'trainType[]', 'trainSponsor[]'],
      { 'trainTitle[]': 'title', 'trainFrom[]': 'date_from', 'trainTo[]': 'date_to', 'trainHours[]': 'hours', 'trainType[]': 'type', 'trainSponsor[]': 'sponsor' });
    
    await replaceDynamicTable('other_info',
      ['otherCat[]', 'otherDetails[]'],
      { 'otherCat[]': 'category', 'otherDetails[]': 'details' });
    
    await replaceDynamicTable('references_table',
      ['refName[]', 'refAddress[]', 'refContact[]'],
      { 'refName[]': 'name', 'refAddress[]': 'address', 'refContact[]': 'contact_no' });
    
    alert("✅ All data saved successfully!");
  } catch (error) {
    console.error("Save error:", error);
    alert("❌ Error saving: " + error.message);
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
}

// Make functions available globally
window.loadUserData = loadUserData;
window.submitForm = submitForm;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadUserData);
} else {
  loadUserData();
}
