import { EventEmitter } from 'node:events';

class NotificationService extends EventEmitter {}

const notificationService = new NotificationService();

notificationService.on('user:registered', (payload) => {
  console.log('Usuario registrado:', payload);
});

notificationService.on('user:logged_in', (payload) => {
  console.log('Usuario ha iniciado sesión:', payload);
});

notificationService.on('user:updated', (payload) => {
  console.log('Usuario actualizado:', payload);
}); 

notificationService.on('user:invited', (payload) => {
  console.log('Usuario invitado:', payload);
});

notificationService.on('user:password_changed', (payload) => {
  console.log('Usuario ha cambiado su contraseña:', payload);
});

notificationService.on('user:verified', (payload) => {
  console.log('Usuario verificado:', payload);
});

notificationService.on('user:deleted', (payload) => {
  console.log('Usuario eliminado:', payload);
});

export default notificationService;