export enum PermissionsEnum {
  // User permissions
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',

  // Role permissions
  CREATE_ROLE = 'create_role',
  READ_ROLE = 'read_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',

  // Permission permissions
  CREATE_PERMISSION = 'create_permission',
  READ_PERMISSION = 'read_permission',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission',

  // Language permissions
  CREATE_LANGUAGE = 'create_language',
  READ_LANGUAGE = 'read_language',
  UPDATE_LANGUAGE = 'update_language',
  DELETE_LANGUAGE = 'delete_language',

  // Book permissions
  CREATE_BOOK = 'create_book',
  READ_BOOK = 'read_book',
  UPDATE_BOOK = 'update_book',
  DELETE_BOOK = 'delete_book',
  PUBLISH_BOOK = 'publish_book',

  // AudioBook permissions
  CREATE_AUDIOBOOK = 'create_audiobook',
  READ_AUDIOBOOK = 'read_audiobook',
  UPDATE_AUDIOBOOK = 'update_audiobook',
  DELETE_AUDIOBOOK = 'delete_audiobook',
  PUBLISH_AUDIOBOOK = 'publish_audiobook',

  // Author permissions
  CREATE_AUTHOR = 'create_author',
  READ_AUTHOR = 'read_author',
  UPDATE_AUTHOR = 'update_author',
  DELETE_AUTHOR = 'delete_author',

  // Genre permissions
  CREATE_GENRE = 'create_genre',
  READ_GENRE = 'read_genre',
  UPDATE_GENRE = 'update_genre',
  DELETE_GENRE = 'delete_genre',

  // Publisher/Issuer permissions
  CREATE_ISSUER = 'create_issuer',
  READ_ISSUER = 'read_issuer',
  UPDATE_ISSUER = 'update_issuer',
  DELETE_ISSUER = 'delete_issuer',

  // News permissions
  CREATE_NEWS = 'create_news',
  READ_NEWS = 'read_news',
  UPDATE_NEWS = 'update_news',
  DELETE_NEWS = 'delete_news',
  PUBLISH_NEWS = 'publish_news',

  // Feedback permissions
  CREATE_FEEDBACK = 'create_feedback',
  READ_FEEDBACK = 'read_feedback',
  UPDATE_FEEDBACK = 'update_feedback',
  DELETE_FEEDBACK = 'delete_feedback',

  // Feedback Theme permissions
  CREATE_FEEDBACK_THEME = 'create_feedback_theme',
  READ_FEEDBACK_THEME = 'read_feedback_theme',
  UPDATE_FEEDBACK_THEME = 'update_feedback_theme',
  DELETE_FEEDBACK_THEME = 'delete_feedback_theme',

  // Upload/File permissions
  CREATE_FILE = 'create_file',
  READ_FILE = 'read_file',
  UPDATE_FILE = 'update_file',
  DELETE_FILE = 'delete_file',
  UPLOAD_FILE = 'upload_file',
  DOWNLOAD_FILE = 'download_file',

  // Book-Audiobook Link permissions
  CREATE_BOOK_AUDIOBOOK_LINK = 'create_book_audiobook_link',
  READ_BOOK_AUDIOBOOK_LINK = 'read_book_audiobook_link',
  UPDATE_BOOK_AUDIOBOOK_LINK = 'update_book_audiobook_link',
  DELETE_BOOK_AUDIOBOOK_LINK = 'delete_book_audiobook_link',

  // Book Review permissions
  CREATE_BOOK_REVIEW = 'create_book_review',
  READ_BOOK_REVIEW = 'read_book_review',
  UPDATE_BOOK_REVIEW = 'update_book_review',
  DELETE_BOOK_REVIEW = 'delete_book_review',
  MODERATE_BOOK_REVIEW = 'moderate_book_review',

  // Audiobook Review permissions
  CREATE_AUDIOBOOK_REVIEW = 'create_audiobook_review',
  READ_AUDIOBOOK_REVIEW = 'read_audiobook_review',
  UPDATE_AUDIOBOOK_REVIEW = 'update_audiobook_review',
  DELETE_AUDIOBOOK_REVIEW = 'delete_audiobook_review',
  MODERATE_AUDIOBOOK_REVIEW = 'moderate_audiobook_review',

  // Help permissions
  CREATE_HELP = 'create_help',
  READ_HELP = 'read_help',
  UPDATE_HELP = 'update_help',
  DELETE_HELP = 'delete_help',

  // Dashboard permissions
  READ_DASHBOARD = 'read_dashboard',
  READ_ANALYTICS = 'read_analytics',
  READ_STATISTICS = 'read_statistics',

  // System administration permissions
  MANAGE_SYSTEM = 'manage_system',
  READ_LOGS = 'read_logs',
  BACKUP_SYSTEM = 'backup_system',
  RESTORE_SYSTEM = 'restore_system',

  // Content moderation permissions
  MODERATE_CONTENT = 'moderate_content',
  APPROVE_CONTENT = 'approve_content',
  REJECT_CONTENT = 'reject_content',

  // Report permissions
  READ_REPORTS = 'read_reports',
  GENERATE_REPORTS = 'generate_reports',
  EXPORT_DATA = 'export_data',
} 