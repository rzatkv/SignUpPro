document.addEventListener('DOMContentLoaded', function() {
    // Initialize Persian Datepicker for birthDate and registrationDate
    const persianPickerOptions = {
        format: 'YYYY/MM/DD',
        autoClose: true
    };
    new persianDate().toLocale('fa').calendar('persian').picker(Object.assign({ altField: '#birthDate' }, persianPickerOptions));
    new persianDate().toLocale('fa').calendar('persian').picker(Object.assign({ altField: '#registrationDate' }, persianPickerOptions));

    // Show or hide fields based on userType selection
    document.getElementById('userType').addEventListener('change', function() {
        const userType = this.value;
        const individualFields = document.getElementById('individualFields');
        const corporateFields = document.getElementById('corporateFields');
        const jobField = document.getElementById('job').parentElement;
        const economicCodeField = document.getElementById('economicCodeField');

        if (userType === 'individual') {
            individualFields.style.display = 'block';
            corporateFields.style.display = 'none';
            jobField.style.display = 'block';
            economicCodeField.style.display = 'block';
        } else {
            individualFields.style.display = 'block';
            corporateFields.style.display = 'block';
            jobField.style.display = 'none';
            economicCodeField.style.display = 'none';
        }
    });

    // Load provinces and cities from an API
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');

    fetch('https://iran-locations-api.example.com/provinces')
        .then(response => response.json())
        .then(data => {
            data.provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province.name;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });
        });

    provinceSelect.addEventListener('change', function() {
        const selectedProvince = this.value;
        citySelect.innerHTML = '<option value="">لطفاً ابتدا استان را انتخاب کنید</option>';

        if (selectedProvince) {
            fetch(`https://iran-locations-api.example.com/provinces/${selectedProvince}/cities`)
                .then(response => response.json())
                .then(data => {
                    data.cities.forEach(city => {
                        const option = document.createElement('option');
                        option.value = city.name;
                        option.textContent = city.name;
                        citySelect.appendChild(option);
                    });
                });
        }
    });

    // Form validation
    const registrationForm = document.getElementById('registrationForm');
    const errorAlert = document.getElementById('errorAlert');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let errors = [];

        // Validate individual fields
        if (userTypeSelect.value === 'individual' || userTypeSelect.value === 'corporate') {
            if (!document.getElementById('firstName').checkValidity() || !/^[؀-ۿ\s]+$/.test(document.getElementById('firstName').value)) {
                errors.push('لطفاً نام خود را فقط با حروف فارسی وارد کنید.');
            }
            if (!document.getElementById('lastName').checkValidity() || !/^[؀-ۿ\s]+$/.test(document.getElementById('lastName').value)) {
                errors.push('لطفاً نام خانوادگی خود را فقط با حروف فارسی وارد کنید.');
            }
            if (!document.getElementById('fatherName').checkValidity() || !/^[؀-ۿ\s]+$/.test(document.getElementById('fatherName').value)) {
                errors.push('لطفاً نام پدر خود را فقط با حروف فارسی وارد کنید.');
            }
            if (!document.getElementById('nationalId').checkValidity() || !/^[0-9]+$/.test(document.getElementById('nationalId').value)) {
                errors.push('لطفاً کد ملی را به درستی وارد کنید.');
            }
            if (!document.getElementById('birthDate').value) {
                errors.push('لطفاً تاریخ تولد خود را وارد کنید.');
            }
        }

        // Validate corporate fields
        if (userTypeSelect.value === 'corporate') {
            if (!document.getElementById('companyName').checkValidity() || !/^[؀-ۿ\s]+$/.test(document.getElementById('companyName').value)) {
                errors.push('لطفاً نام شرکت را فقط با حروف فارسی وارد کنید.');
            }
            if (!document.getElementById('registrationNumber').checkValidity() || !/^[0-9]+$/.test(document.getElementById('registrationNumber').value)) {
                errors.push('لطفاً شماره ثبت شرکت را به درستی وارد کنید.');
            }
            if (!document.getElementById('registrationDate').value) {
                errors.push('لطفاً تاریخ ثبت شرکت را وارد کنید.');
            }
            if (!document.getElementById('corporateEconomicCode').checkValidity() || !/^[0-9]+$/.test(document.getElementById('corporateEconomicCode').value)) {
                errors.push('لطفاً کد اقتصادی را به درستی وارد کنید.');
            }
        }

        // Show errors or submit the form
        if (errors.length > 0) {
            errorAlert.innerHTML = errors.join('<br>');
        } else {
            errorAlert.innerHTML = '';
            // Submit the form (to be implemented)
        }
    });
});
