/**
 * Enum for all test IDs used in the application.
 * This helps maintain consistency and provides autocomplete support.
 * 
 * Naming convention:
 * - button-{action}-{context?}  : For buttons
 * - input-{field}-{context?}    : For input fields
 * - form-{type}                 : For forms
 * - modal-{type}                : For modals
 * - container-{type}            : For container elements
 * - text-{type}                 : For text elements
 * - page-{name}                 : For page components
 * - list-{type}                 : For list components
 * - nav-{type}                  : For navigation components
 */
export enum TestId {
  // Containers
  ContainerMain = 'container-main',
  ContainerWelcome = 'container-welcome',
  ContainerAuth = 'container-auth',
  ContainerAuthForm = 'container-auth-form',
  ContainerAuthButtons = 'container-auth-buttons',
  ContainerDashboard = 'container-dashboard',
  ContainerPartyForm = 'container-party-form',
  ContainerPartyList = 'container-party-list',
  ContainerSidebar = 'container-sidebar',

  // Navigation
  NavMain = 'nav-main',
  NavSidebar = 'nav-sidebar',
  NavFooter = 'nav-footer',

  // Buttons
  ButtonSignIn = 'button-signin',
  ButtonSignUp = 'button-signup',
  ButtonManageParties = 'button-manage-parties',
  ButtonCreateParty = 'button-create-party',
  ButtonSubmitParty = 'button-submit-party',
  ButtonInviteGuest = 'button-invite-guest',
  ButtonCancelModal = 'button-cancel-modal',
  ButtonEditParty = 'button-edit-party',

  // Text
  TextAppTitle = 'text-app-title',
  TextAppTagline = 'text-app-tagline',
  TextErrorMessage = 'text-error-message',
  TextSuccessMessage = 'text-success-message',
  TextPartyTitle = 'text-party-title',
  TextWelcome = 'text-welcome',

  // Pages
  PageDashboard = 'page-dashboard',
  PageSettings = 'page-settings',
  PagePartyDetails = 'page-party-details',

  // Forms
  FormCreateParty = 'form-create-party',
  FormEditParty = 'form-edit-party',
  FormLogin = 'form-login',
  FormSignup = 'form-signup',

  // Inputs
  InputPartyName = 'input-party-name',
  InputPartyDate = 'input-party-date',
  InputPartyLocation = 'input-party-location',
  InputGuestEmail = 'input-guest-email',
  InputEmailSignup = 'input-email-signup',
  InputPasswordLogin = 'input-password-login',

  // Lists
  ListParties = 'list-parties',
  ListGuests = 'list-guests',
  ListItems = 'list-items',

  // Modals
  ModalConfirmDelete = 'modal-confirm-delete',
  ModalPartyDetails = 'modal-party-details',
  ModalSettings = 'modal-settings'
} 