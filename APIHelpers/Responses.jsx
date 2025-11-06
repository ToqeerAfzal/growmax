import Swal from 'sweetalert2'

export const headersWithAuthWithoutBody = (method, auth) => ({
  method: method,
  headers: auth,
});

export const headersWithAuth = (method, userData, auth) => ({
  method: method,
  headers: auth,
  body: JSON.stringify(userData),
});

export const handleResponse = (response) =>
  response.statusCode === 200
    ? Swal.fire({
      icon: 'success',
      title: "Success",
      text: response.customMessage,
      showConfirmButton: false,
      timer: 1500
    })
    : Swal.fire({
      icon: 'error',
      title: "Error",
      text: response.customMessage,
      showConfirmButton: false,
      timer: 1500
    })