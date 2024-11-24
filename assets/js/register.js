$(document).ready(function () {
  // Form Steps
  const step1 = $("#step-1");
  const step2 = $("#step-2");
  const nextBtn = $("#nextBtn");
  const prevBtn = $("#prevBtn");
  const submitBtn = $("#submitBtn");

  // Progress Bar
  const progressBar = $("#progressBar");

  // User Type Fields
  const userTypeSelect = $("#userType");
  const individualFields = $("#individualFields");
  const corporateFields = $("#corporateFields");
  const economicCodeField = $("#economicCodeField");
  const corporateEconomicCodeField = $("#corporateEconomicCodeField");

  // Common Fields
  const commonFields = $("#commonFields");

  // Error Alert
  const errorAlert = $("#errorAlert");

  // Static Provinces and Cities Mapping
  const provinceCityMapping = {
    تهران: ["تهران", "اسلامشهر", "پردیس", "شهریار"],
    اصفهان: ["اصفهان", "نجف‌آباد", "میاندوآب"],
    "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار"],
    // Add more provinces and their cities as needed
  };

  // Total number of required fields
  const totalRequiredFields = $("#registrationForm").find("[required]").length;

  // Function to update progress bar
  function updateProgressBar() {
    const filledFields = $("#registrationForm")
      .find("[required]")
      .filter(function () {
        const val = $(this).val();
        if (typeof val === "string") {
          return val.trim() !== "" && !$(this).hasClass("is-invalid");
        } else {
          return val !== null && !$(this).hasClass("is-invalid");
        }
      }).length;

    const progressPercent = Math.round(
      (filledFields / totalRequiredFields) * 100
    );
    progressBar.css("width", `${progressPercent}%`);
    progressBar.attr("aria-valuenow", progressPercent);
    progressBar.text(`${progressPercent}%`);
  }

  // Initial Progress
  updateProgressBar();

  // Real-Time Validation Function
  function validateField(field) {
    if (field.prop("required")) {
      const val = field.val();
      if (typeof val === "string") {
        if (val.trim() === "") {
          field.removeClass("is-valid").addClass("is-invalid");
          return false;
        } else if (field.attr("pattern")) {
          const pattern = new RegExp(field.attr("pattern"));
          if (!pattern.test(val.trim())) {
            field.removeClass("is-valid").addClass("is-invalid");
            return false;
          } else {
            field.removeClass("is-invalid").addClass("is-valid");
            return true;
          }
        } else if (field.attr("type") === "email") {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(val.trim())) {
            field.removeClass("is-valid").addClass("is-invalid");
            return false;
          } else {
            field.removeClass("is-invalid").addClass("is-valid");
            return true;
          }
        } else {
          field.removeClass("is-invalid").addClass("is-valid");
          return true;
        }
      } else {
        if (val === null) {
          field.removeClass("is-valid").addClass("is-invalid");
          return false;
        } else {
          field.removeClass("is-invalid").addClass("is-valid");
          return true;
        }
      }
    }
    return true;
  }

  // Attach real-time validation to input fields
  $(
    "#registrationForm input, #registrationForm select, #registrationForm textarea"
  ).on("input change", function () {
    const field = $(this);
    validateField(field);

    if (
      field.attr("id") === "confirmPassword" ||
      field.attr("id") === "password"
    ) {
      const password = $("#password").val();
      const confirmPassword = $("#confirmPassword").val();
      if (password !== confirmPassword) {
        $("#confirmPassword").removeClass("is-valid").addClass("is-invalid");
      } else if (confirmPassword.length >= 8) {
        $("#confirmPassword").removeClass("is-invalid").addClass("is-valid");
      }
    }

    updateProgressBar();
  });

  // Next Button Click
  nextBtn.on("click", function () {
    const userType = userTypeSelect.val();
    const termsChecked = $("#termsCheckbox").is(":checked");
    let valid = true;

    if (!userType) {
      userTypeSelect.removeClass("is-valid").addClass("is-invalid");
      valid = false;
    } else {
      userTypeSelect.removeClass("is-invalid").addClass("is-valid");
    }

    if (!termsChecked) {
      $("#termsCheckbox").removeClass("is-valid").addClass("is-invalid");
      valid = false;
    } else {
      $("#termsCheckbox").removeClass("is-invalid").addClass("is-valid");
    }

    if (!valid) {
      updateProgressBar();
      return;
    }

    step1.removeClass("active");
    step2.addClass("active");
    prevBtn.removeClass("d-none");
    updateProgressBar();
  });

  // Previous Button Click
  prevBtn.on("click", function () {
    step2.removeClass("active");
    step1.addClass("active");
    prevBtn.addClass("d-none");
    updateProgressBar();
  });

  // Form Submission
  submitBtn.on("click", function () {
    let errors = [];
    let valid = true;
    const userType = userTypeSelect.val();

    if (userType === "individual") {
      const firstName = $("#firstName");
      const lastName = $("#lastName");
      const fatherName = $("#fatherName");
      const nationalId = $("#nationalId");
      const birthDate = $("#birthDate");
      const economicCode = $("#economicCode");

      if (!validateField(firstName)) {
        errors.push("لطفاً نام خود را فقط با حروف فارسی وارد کنید.");
        valid = false;
      }

      if (!validateField(lastName)) {
        errors.push("لطفاً نام خانوادگی خود را فقط با حروف فارسی وارد کنید.");
        valid = false;
      }

      if (!validateField(fatherName)) {
        errors.push("لطفاً نام پدر خود را فقط با حروف فارسی وارد کنید.");
        valid = false;
      }

      if (!validateField(nationalId)) {
        errors.push("لطفاً کد ملی را 10 رقم وارد کنید.");
        valid = false;
      }

      if (!validateField(birthDate)) {
        errors.push("لطفاً تاریخ تولد خود را وارد کنید.");
        valid = false;
      }

      if (!validateField(economicCode)) {
        errors.push("لطفاً کد اقتصادی را 9 تا 12 رقم وارد کنید.");
        valid = false;
      }
    }

    if (userType === "corporate") {
      const companyName = $("#companyName");
      const registrationNumber = $("#registrationNumber");
      const registrationDate = $("#registrationDate");
      const corporateEconomicCode = $("#corporateEconomicCode");

      if (!validateField(companyName)) {
        errors.push("لطفاً نام شرکت را فقط با حروف فارسی وارد کنید.");
        valid = false;
      }

      if (!validateField(registrationNumber)) {
        errors.push("لطفاً شماره ثبت شرکت را 2 تا 12 رقم وارد کنید.");
        valid = false;
      }

      if (!validateField(registrationDate)) {
        errors.push("لطفاً تاریخ ثبت شرکت را وارد کنید.");
        valid = false;
      }

      if (!validateField(corporateEconomicCode)) {
        errors.push("لطفاً کد مالیاتی را 9 تا 12 رقم وارد کنید.");
        valid = false;
      }
    }

    const address = $("#address");
    const province = $("#province");
    const city = $("#city");
    const postalCode = $("#postalCode");
    const mobileNumber = $("#mobileNumber");
    const email = $("#email");
    const password = $("#password");
    const confirmPassword = $("#confirmPassword");
    const job = $("#job");

    if (!validateField(address)) {
      errors.push("لطفاً آدرس خود را وارد کنید.");
      valid = false;
    }

    if (!validateField(province)) {
      errors.push("لطفاً استان را انتخاب کنید.");
      valid = false;
    }

    if (!validateField(city)) {
      errors.push("لطفاً شهر را انتخاب کنید.");
      valid = false;
    }

    if (!validateField(postalCode)) {
      errors.push("لطفاً کد پستی را 10 رقم وارد کنید.");
      valid = false;
    }

    if (!validateField(mobileNumber)) {
      errors.push(
        "لطفاً شماره موبایل را به درستی وارد کنید (مثال: 09123456789)."
      );
      valid = false;
    }

    if (!validateField(email)) {
      errors.push("لطفاً ایمیل معتبر وارد کنید.");
      valid = false;
    }

    if (!validateField(password)) {
      errors.push("لطفاً گذرواژه را با حداقل 8 کاراکتر وارد کنید.");
      valid = false;
    }

    const pwd = password.val();
    const cpwd = confirmPassword.val();
    if (pwd !== cpwd || cpwd.length < 8) {
      confirmPassword.removeClass("is-valid").addClass("is-invalid");
      errors.push("گذرواژه‌ها باید مطابقت داشته باشند.");
      valid = false;
    } else {
      confirmPassword.removeClass("is-invalid").addClass("is-valid");
    }

    if (!validateField(job)) {
      errors.push("لطفاً شغل خود را انتخاب کنید.");
      valid = false;
    }

    if (!valid) {
      errorAlert.html(errors.join("<br>"));
      errorAlert.show();
      $("html, body").animate({ scrollTop: 0 }, "fast");
      updateProgressBar();
    } else {
      errorAlert.html("");
      errorAlert.hide();
      alert("ثبت نام با موفقیت انجام شد.");
      $("#registrationForm")[0].reset();
      $(
        "#registrationForm input, #registrationForm select, #registrationForm textarea"
      ).removeClass("is-valid is-invalid");
      step2.removeClass("active");
      step1.addClass("active");
      prevBtn.addClass("d-none");
      updateProgressBar();
      $("#city").html(
        '<option value="" selected disabled>لطفاً ابتدا استان را انتخاب کنید</option>'
      );
    }
  });

  // Dynamic Field Display Based on User Type
  userTypeSelect.on("change", function () {
    const userType = $(this).val();
    if (userType === "individual") {
      individualFields.removeClass("d-none");
      corporateFields.addClass("d-none");
      economicCodeField.removeClass("d-none");
      corporateEconomicCodeField.addClass("d-none");
    } else if (userType === "corporate") {
      individualFields.addClass("d-none");
      corporateFields.removeClass("d-none");
      economicCodeField.addClass("d-none");
      corporateEconomicCodeField.removeClass("d-none");
    }
    updateProgressBar();
  });

  // Populate Cities Based on Selected Province
  $("#province").on("change", function () {
    const selectedProvince = $(this).val();
    const cities = provinceCityMapping[selectedProvince] || [];

    const citySelect = $("#city");
    citySelect.empty();
    if (cities.length > 0) {
      citySelect.append(
        '<option value="" selected disabled>لطفاً شهر را انتخاب کنید</option>'
      );
      cities.forEach(function (city) {
        citySelect.append(`<option value="${city}">${city}</option>`);
      });
    } else {
      citySelect.append(
        '<option value="" selected disabled>شهر یافت نشد</option>'
      );
    }
    updateProgressBar();
  });

  // Password Visibility Toggle
  $(".toggle-password").on("click", function () {
    const input = $(this).siblings("input");
    const icon = $(this).find("i");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
      icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      input.attr("type", "password");
      icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });

  // Initial setup for password fields
  updateProgressBar();
});
