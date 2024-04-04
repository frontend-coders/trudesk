import { all } from 'redux-saga/effects'
import CommonSaga from './common'
import DashboardSaga from './dashboard'
import SettingsSaga from './settings'
import TicketSaga from './tickets'
import AccountSaga from './accounts'
import GroupSaga from './groups'
import TeamSaga from './teams'
import DepartmentSaga from './departments'
import NoticeSage from './notices'
import SearchSaga from './search'
import MessagesSaga from './messages'
import ReportsSaga from './reports'

export default function * IndexSagas () {
  yield all([
    CommonSaga(),
    DashboardSaga(),
    TicketSaga(),
    SettingsSaga(),
    AccountSaga(),
    GroupSaga(),
    TeamSaga(),
    DepartmentSaga(),
    NoticeSage(),
    SearchSaga(),
    MessagesSaga(),
    ReportsSaga()
  ])
}
