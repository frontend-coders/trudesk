const exported = {}

// GLOBAL
exported.UI_ONLINE_STATUS_UPDATE = '$trudesk:global:ui:online_status:update'
exported.UI_ONLINE_STATUS_SET = '$trudesk:global:ui:online_status:set'
exported.USERS_UPDATE = '$trudesk:users:update'

// ROLES
exported.ROLES_FLUSH = '$trudesk:roles:flush'

// TICKETS
exported.TICKETS_CREATED = '$trudesk:tickets:created'
exported.TICKETS_UPDATE = '$trudesk:tickets:update'
// --- SUB TICKET EVENTS
exported.TICKETS_UI_STATUS_UPDATE = '$trudesk:tickets:ui:status:update'
exported.TICKETS_STATUS_SET = '$trudesk:tickets:status:set'

exported.TICKETS_UI_GROUP_UPDATE = '$trudesk:tickets:ui:group:update'
exported.TICKETS_GROUP_SET = '$trudesk:tickets:group:set'

exported.TICKETS_UI_TYPE_UPDATE = '$trudesk:tickets:ui:type:update'
exported.TICKETS_TYPE_SET = '$trudesk:tickets:type:set'

exported.TICKETS_UI_PRIORITY_UPDATE = '$trudesk:tickets:ui:priority:update'
exported.TICKETS_PRIORITY_SET = '$trudesk:tickets:priority:set'

exported.TICKETS_UI_DUEDATE_UPDATE = '$trudesk:tickets:ui:duedate:update'
exported.TICKETS_DUEDATE_SET = '$trudesk:tickets:duedate:set'

exported.TICKETS_UI_TAGS_UPDATE = '$trudesk:tickets:ui:tags:update'
exported.TICKETS_TAGS_SET = '$trudesk:tickets:tags:set'

exported.TICKETS_ASSIGNEE_LOAD = '$trudesk:tickets:assignee:load'
exported.TICKETS_ASSIGNEE_SET = '$trudesk:tickets:assignee:set'
exported.TICKETS_ASSIGNEE_CLEAR = '$trudesk:tickets:assignee:clear'
exported.TICKETS_ASSIGNEE_UPDATE = '$trudesk:tickets:assignee: update'

exported.TICKETS_ISSUE_SET = '$trudesk:tickets:issue:set'

exported.TICKETS_COMMENT_NOTE_REMOVE = '$trudesk:tickets:comment_note:remove'
exported.TICKETS_COMMENT_NOTE_SET = '$trudesk:tickets:comment_note:set'

exported.TICKETS_UI_ATTACHMENTS_UPDATE = '$trudesk:tickets:ui:attachments:update'

// ACCOUNTS
exported.ACCOUNTS_UI_PROFILE_IMAGE_UPDATE = '$trudesk:accounts:ui:profile_image:update'

// NOTIFICATIONS
exported.NOTIFICATIONS_UPDATE = '$trudesk:notifications:update'
exported.NOTIFICATIONS_MARK_READ = '$trudesk:notifications:mark_read'
exported.NOTIFICATIONS_CLEAR = '$trudesk:notifications:clear'

// MESSAGES
exported.MESSAGES_SEND = '$trudesk:messages:send'
exported.MESSAGES_UI_RECEIVE = '$trudesk:messages:ui:receive'
exported.MESSAGES_USER_TYPING = '$trudesk:messages:user_typing'
exported.MESSAGES_UI_USER_TYPING = '$trudesk:messages:ui:user_typing'
exported.MESSAGES_SPAWN_CHAT_WINDOW = '$trudesk:messages:spawn_chat_window'
exported.MESSAGES_UI_SPAWN_CHAT_WINDOW = '$trudesk:messages:ui:spawn_chat_window'
exported.MESSAGES_SAVE_CHAT_WINDOW = '$trudesk:messages:save_chat_window'
exported.MESSAGES_SAVE_CHAT_WINDOW_COMPLETE = '$trudesk:messages:save_chat_window_complete'
exported.MESSAGES_UPDATE_UI_CONVERSATION_NOTIFICATIONS = '$trudesk:messages:ui:conversation_notifications:update'

// NOTICES
exported.NOTICE_SHOW = '$trudesk:notice:show'
exported.NOTICE_UI_SHOW = '$trudesk:notice:ui:show'
exported.NOTICE_CLEAR = '$trudesk:notice:clear'
exported.NOTICE_UI_CLEAR = '$trudesk:notice:ui:clear'

// BACKUP / RESTORE
exported.BACKUP_RESTORE_SHOW_OVERLAY = '$trudesk:backup_restore:show_overlay'
exported.BACKUP_RESTORE_UI_SHOW_OVERLAY = '$trudesk:backup_restore:ui:show_overlay'
exported.BACKUP_RESTORE_COMPLETE = '$trudesk:backup_restore:complete'
exported.BACKUP_RESTORE_UI_COMPLETE = '$trudesk:backup_restore:ui:complete'

module.exports = exported
