import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import AppearanceController from './AppearanceController'
import SessionsController from './SessionsController'
import DataExportController from './DataExportController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    AppearanceController: Object.assign(AppearanceController, AppearanceController),
    SessionsController: Object.assign(SessionsController, SessionsController),
    DataExportController: Object.assign(DataExportController, DataExportController),
    TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
}

export default Settings