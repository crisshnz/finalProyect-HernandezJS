const btnSave = document.getElementById("btn-save");

const dropdown = document.getElementById("hour-client");
const getInitialData = async () => {
  try {
    await fetch("./../services.json")
      .then((response) => response.json())
      .then((data) => {
        const services = data.services;
        buildPricesTable(services);
      });
  } catch (error) {
    console.log(error);
  }
};

const buildPricesTable = (services) => {
  const tableBody = document.querySelector("#prices-table tbody");
  tableBody.innerHTML = "";

  services.forEach((service) => {
    const row = document.createElement("tr");
    const serviceNameCell = document.createElement("td");
    serviceNameCell.textContent = service.name;
    const servicePriceCell = document.createElement("td");
    servicePriceCell.textContent = "$" + service.cost.toFixed(2);

    row.appendChild(serviceNameCell);
    row.appendChild(servicePriceCell);
    tableBody.appendChild(row);
  });
};

const hours = [
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

const getByLocalStorage = () => {
  return JSON.parse(localStorage.getItem("client"));
};
const getOldAppointments = getByLocalStorage();
const notAvailableHours = getOldAppointments
  ? getOldAppointments.selectedHour
  : [];
const removeNumbersFromArray = (hours, notAvailableHours) => {
  const filteredArray = hours.filter(
    (element) => !notAvailableHours.includes(element)
  );
  return filteredArray;
};

const getAvailableHours = removeNumbersFromArray(hours, notAvailableHours);

getAvailableHours.map((hour) => {
  let option = document.createElement("option");
  option.text = hour;
  option.value = hour;
  dropdown.add(option);
});

const saveInLocalStorage = (client) => {
  const oldData = getByLocalStorage();
  if (!oldData) {
    return localStorage.setItem("client", JSON.stringify(client));
  }

  if (!Array.isArray(oldData.selectedHour)) {
    oldData.selectedHour = [oldData.selectedHour];
  }
  const selectedHour = client.selectedHour;

  const dataToSave = {
    ...oldData,
    selectedHour: [...oldData.selectedHour, selectedHour],
  };
  localStorage.setItem("client", JSON.stringify(dataToSave));
};

const saveClient = () => {
  const nameClient = document.getElementById("name-client").value.trim();
  const surnameClient = document.getElementById("surname-client").value.trim();
  const dateClient = document.getElementById("date-client").value;
  const selectedHour = document.getElementById("hour-client").value;
  if (!nameClient || !surnameClient || !dateClient || !selectedHour) {
    Swal.fire({
      icon: "error",
      title: "¡Alguno de los campos está vacío!",
      text: "Por favor, rellene el formulario nuevamente.",
    });
    return;
  }

  let client = {
    nameClient,
    surnameClient,
    dateClient,
    selectedHour,
  };

  saveInLocalStorage(client);

  Swal.fire({
    title: "¡Su turno fue registrado con éxito!",
    text: "¡Lo esperamos!",
    icon: "success",
    confirmButtonText: false,
    showConfirmButton: false,
  });
  setTimeout(() => {
    window.location.reload();
  }, 1500);
};

getInitialData();
btnSave.addEventListener("click", saveClient);
