import { DataSource } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { PermissionsEnum } from '../../../common/enums/permission.enum';

interface PermissionTranslation {
  en: string;
  uz: string;
  ru: string;
}

interface PermissionData {
  action: PermissionsEnum;
  name: PermissionTranslation;
}

export class PermissionSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const permissionRepository = this.dataSource.getRepository(Permission);

    // Define comprehensive permissions with proper translations
    const permissionsData: PermissionData[] = [
      // User Management Permissions
      {
        action: PermissionsEnum.CREATE_USER,
        name: { en: 'Create User', uz: 'Foydalanuvchi yaratish', ru: 'Создать пользователя' }
      },
      {
        action: PermissionsEnum.READ_USER,
        name: { en: 'Read User', uz: 'Foydalanuvchini ko\'rish', ru: 'Просмотр пользователя' }
      },
      {
        action: PermissionsEnum.UPDATE_USER,
        name: { en: 'Update User', uz: 'Foydalanuvchini tahrirlash', ru: 'Обновить пользователя' }
      },
      {
        action: PermissionsEnum.DELETE_USER,
        name: { en: 'Delete User', uz: 'Foydalanuvchini o\'chirish', ru: 'Удалить пользователя' }
      },

      // Role Management Permissions
      {
        action: PermissionsEnum.CREATE_ROLE,
        name: { en: 'Create Role', uz: 'Rol yaratish', ru: 'Создать роль' }
      },
      {
        action: PermissionsEnum.READ_ROLE,
        name: { en: 'Read Role', uz: 'Rolni ko\'rish', ru: 'Просмотр роли' }
      },
      {
        action: PermissionsEnum.UPDATE_ROLE,
        name: { en: 'Update Role', uz: 'Rolni tahrirlash', ru: 'Обновить роль' }
      },
      {
        action: PermissionsEnum.DELETE_ROLE,
        name: { en: 'Delete Role', uz: 'Rolni o\'chirish', ru: 'Удалить роль' }
      },

      // Permission Management Permissions
      {
        action: PermissionsEnum.CREATE_PERMISSION,
        name: { en: 'Create Permission', uz: 'Ruxsat yaratish', ru: 'Создать разрешение' }
      },
      {
        action: PermissionsEnum.READ_PERMISSION,
        name: { en: 'Read Permission', uz: 'Ruxsatni ko\'rish', ru: 'Просмотр разрешения' }
      },
      {
        action: PermissionsEnum.UPDATE_PERMISSION,
        name: { en: 'Update Permission', uz: 'Ruxsatni tahrirlash', ru: 'Обновить разрешение' }
      },
      {
        action: PermissionsEnum.DELETE_PERMISSION,
        name: { en: 'Delete Permission', uz: 'Ruxsatni o\'chirish', ru: 'Удалить разрешение' }
      },

      // Language Management Permissions
      {
        action: PermissionsEnum.CREATE_LANGUAGE,
        name: { en: 'Create Language', uz: 'Til yaratish', ru: 'Создать язык' }
      },
      {
        action: PermissionsEnum.READ_LANGUAGE,
        name: { en: 'Read Language', uz: 'Tilni ko\'rish', ru: 'Просмотр языка' }
      },
      {
        action: PermissionsEnum.UPDATE_LANGUAGE,
        name: { en: 'Update Language', uz: 'Tilni tahrirlash', ru: 'Обновить язык' }
      },
      {
        action: PermissionsEnum.DELETE_LANGUAGE,
        name: { en: 'Delete Language', uz: 'Tilni o\'chirish', ru: 'Удалить язык' }
      },

      // Book Management Permissions
      {
        action: PermissionsEnum.CREATE_BOOK,
        name: { en: 'Create Book', uz: 'Kitob yaratish', ru: 'Создать книгу' }
      },
      {
        action: PermissionsEnum.READ_BOOK,
        name: { en: 'Read Book', uz: 'Kitobni ko\'rish', ru: 'Просмотр книги' }
      },
      {
        action: PermissionsEnum.UPDATE_BOOK,
        name: { en: 'Update Book', uz: 'Kitobni tahrirlash', ru: 'Обновить книгу' }
      },
      {
        action: PermissionsEnum.DELETE_BOOK,
        name: { en: 'Delete Book', uz: 'Kitobni o\'chirish', ru: 'Удалить книгу' }
      },
      {
        action: PermissionsEnum.PUBLISH_BOOK,
        name: { en: 'Publish Book', uz: 'Kitobni nashr etish', ru: 'Опубликовать книгу' }
      },

      // AudioBook Management Permissions
      {
        action: PermissionsEnum.CREATE_AUDIOBOOK,
        name: { en: 'Create AudioBook', uz: 'Audio kitob yaratish', ru: 'Создать аудиокнигу' }
      },
      {
        action: PermissionsEnum.READ_AUDIOBOOK,
        name: { en: 'Read AudioBook', uz: 'Audio kitobni ko\'rish', ru: 'Просмотр аудиокниги' }
      },
      {
        action: PermissionsEnum.UPDATE_AUDIOBOOK,
        name: { en: 'Update AudioBook', uz: 'Audio kitobni tahrirlash', ru: 'Обновить аудиокнигу' }
      },
      {
        action: PermissionsEnum.DELETE_AUDIOBOOK,
        name: { en: 'Delete AudioBook', uz: 'Audio kitobni o\'chirish', ru: 'Удалить аудиокнигу' }
      },
      {
        action: PermissionsEnum.PUBLISH_AUDIOBOOK,
        name: { en: 'Publish AudioBook', uz: 'Audio kitobni nashr etish', ru: 'Опубликовать аудиокнигу' }
      },

      // Author Management Permissions
      {
        action: PermissionsEnum.CREATE_AUTHOR,
        name: { en: 'Create Author', uz: 'Muallif yaratish', ru: 'Создать автора' }
      },
      {
        action: PermissionsEnum.READ_AUTHOR,
        name: { en: 'Read Author', uz: 'Muallifni ko\'rish', ru: 'Просмотр автора' }
      },
      {
        action: PermissionsEnum.UPDATE_AUTHOR,
        name: { en: 'Update Author', uz: 'Muallifni tahrirlash', ru: 'Обновить автора' }
      },
      {
        action: PermissionsEnum.DELETE_AUTHOR,
        name: { en: 'Delete Author', uz: 'Muallifni o\'chirish', ru: 'Удалить автора' }
      },

      // Genre Management Permissions
      {
        action: PermissionsEnum.CREATE_GENRE,
        name: { en: 'Create Genre', uz: 'Janr yaratish', ru: 'Создать жанр' }
      },
      {
        action: PermissionsEnum.READ_GENRE,
        name: { en: 'Read Genre', uz: 'Janrni ko\'rish', ru: 'Просмотр жанра' }
      },
      {
        action: PermissionsEnum.UPDATE_GENRE,
        name: { en: 'Update Genre', uz: 'Janrni tahrirlash', ru: 'Обновить жанр' }
      },
      {
        action: PermissionsEnum.DELETE_GENRE,
        name: { en: 'Delete Genre', uz: 'Janrni o\'chirish', ru: 'Удалить жанр' }
      },

      // Publisher/Issuer Management Permissions
      {
        action: PermissionsEnum.CREATE_ISSUER,
        name: { en: 'Create Publisher', uz: 'Nashriyot yaratish', ru: 'Создать издательство' }
      },
      {
        action: PermissionsEnum.READ_ISSUER,
        name: { en: 'Read Publisher', uz: 'Nashriyotni ko\'rish', ru: 'Просмотр издательства' }
      },
      {
        action: PermissionsEnum.UPDATE_ISSUER,
        name: { en: 'Update Publisher', uz: 'Nashriyotni tahrirlash', ru: 'Обновить издательство' }
      },
      {
        action: PermissionsEnum.DELETE_ISSUER,
        name: { en: 'Delete Publisher', uz: 'Nashriyotni o\'chirish', ru: 'Удалить издательство' }
      },

      // News Management Permissions
      {
        action: PermissionsEnum.CREATE_NEWS,
        name: { en: 'Create News', uz: 'Yangilik yaratish', ru: 'Создать новость' }
      },
      {
        action: PermissionsEnum.READ_NEWS,
        name: { en: 'Read News', uz: 'Yangilikni ko\'rish', ru: 'Просмотр новости' }
      },
      {
        action: PermissionsEnum.UPDATE_NEWS,
        name: { en: 'Update News', uz: 'Yangilikni tahrirlash', ru: 'Обновить новость' }
      },
      {
        action: PermissionsEnum.DELETE_NEWS,
        name: { en: 'Delete News', uz: 'Yangilikni o\'chirish', ru: 'Удалить новость' }
      },
      {
        action: PermissionsEnum.PUBLISH_NEWS,
        name: { en: 'Publish News', uz: 'Yangilikni nashr etish', ru: 'Опубликовать новость' }
      },

      // Feedback Management Permissions
      {
        action: PermissionsEnum.CREATE_FEEDBACK,
        name: { en: 'Create Feedback', uz: 'Fikr-mulohaza yaratish', ru: 'Создать отзыв' }
      },
      {
        action: PermissionsEnum.READ_FEEDBACK,
        name: { en: 'Read Feedback', uz: 'Fikr-mulohazani ko\'rish', ru: 'Просмотр отзыва' }
      },
      {
        action: PermissionsEnum.UPDATE_FEEDBACK,
        name: { en: 'Update Feedback', uz: 'Fikr-mulohazani tahrirlash', ru: 'Обновить отзыв' }
      },
      {
        action: PermissionsEnum.DELETE_FEEDBACK,
        name: { en: 'Delete Feedback', uz: 'Fikr-mulohazani o\'chirish', ru: 'Удалить отзыв' }
      },

      // Feedback Theme Management Permissions
      {
        action: PermissionsEnum.CREATE_FEEDBACK_THEME,
        name: { en: 'Create Feedback Theme', uz: 'Fikr-mulohaza mavzusi yaratish', ru: 'Создать тему отзыва' }
      },
      {
        action: PermissionsEnum.READ_FEEDBACK_THEME,
        name: { en: 'Read Feedback Theme', uz: 'Fikr-mulohaza mavzusini ko\'rish', ru: 'Просмотр темы отзыва' }
      },
      {
        action: PermissionsEnum.UPDATE_FEEDBACK_THEME,
        name: { en: 'Update Feedback Theme', uz: 'Fikr-mulohaza mavzusini tahrirlash', ru: 'Обновить тему отзыва' }
      },
      {
        action: PermissionsEnum.DELETE_FEEDBACK_THEME,
        name: { en: 'Delete Feedback Theme', uz: 'Fikr-mulohaza mavzusini o\'chirish', ru: 'Удалить тему отзыва' }
      },

      // File Management Permissions
      {
        action: PermissionsEnum.CREATE_FILE,
        name: { en: 'Create File', uz: 'Fayl yaratish', ru: 'Создать файл' }
      },
      {
        action: PermissionsEnum.READ_FILE,
        name: { en: 'Read File', uz: 'Faylni ko\'rish', ru: 'Просмотр файла' }
      },
      {
        action: PermissionsEnum.UPDATE_FILE,
        name: { en: 'Update File', uz: 'Faylni tahrirlash', ru: 'Обновить файл' }
      },
      {
        action: PermissionsEnum.DELETE_FILE,
        name: { en: 'Delete File', uz: 'Faylni o\'chirish', ru: 'Удалить файл' }
      },
      {
        action: PermissionsEnum.UPLOAD_FILE,
        name: { en: 'Upload File', uz: 'Fayl yuklash', ru: 'Загрузить файл' }
      },
      {
        action: PermissionsEnum.DOWNLOAD_FILE,
        name: { en: 'Download File', uz: 'Fayl yuklab olish', ru: 'Скачать файл' }
      },

      // Book-Audiobook Link Management Permissions
      {
        action: PermissionsEnum.CREATE_BOOK_AUDIOBOOK_LINK,
        name: { en: 'Create Book-Audiobook Link', uz: 'Kitob-Audio kitob bog\'lanishini yaratish', ru: 'Создать связь книга-аудиокнига' }
      },
      {
        action: PermissionsEnum.READ_BOOK_AUDIOBOOK_LINK,
        name: { en: 'Read Book-Audiobook Link', uz: 'Kitob-Audio kitob bog\'lanishini ko\'rish', ru: 'Просмотр связи книга-аудиокнига' }
      },
      {
        action: PermissionsEnum.UPDATE_BOOK_AUDIOBOOK_LINK,
        name: { en: 'Update Book-Audiobook Link', uz: 'Kitob-Audio kitob bog\'lanishini tahrirlash', ru: 'Обновить связь книга-аудиокнига' }
      },
      {
        action: PermissionsEnum.DELETE_BOOK_AUDIOBOOK_LINK,
        name: { en: 'Delete Book-Audiobook Link', uz: 'Kitob-Audio kitob bog\'lanishini o\'chirish', ru: 'Удалить связь книга-аудиокнига' }
      },

      // Review Management Permissions
      {
        action: PermissionsEnum.CREATE_BOOK_REVIEW,
        name: { en: 'Create Book Review', uz: 'Kitob sharhini yaratish', ru: 'Создать рецензию книги' }
      },
      {
        action: PermissionsEnum.READ_BOOK_REVIEW,
        name: { en: 'Read Book Review', uz: 'Kitob sharhini ko\'rish', ru: 'Просмотр рецензии книги' }
      },
      {
        action: PermissionsEnum.UPDATE_BOOK_REVIEW,
        name: { en: 'Update Book Review', uz: 'Kitob sharhini tahrirlash', ru: 'Обновить рецензию книги' }
      },
      {
        action: PermissionsEnum.DELETE_BOOK_REVIEW,
        name: { en: 'Delete Book Review', uz: 'Kitob sharhini o\'chirish', ru: 'Удалить рецензию книги' }
      },
      {
        action: PermissionsEnum.MODERATE_BOOK_REVIEW,
        name: { en: 'Moderate Book Review', uz: 'Kitob sharhini moderatsiya qilish', ru: 'Модерировать рецензию книги' }
      },

      {
        action: PermissionsEnum.CREATE_AUDIOBOOK_REVIEW,
        name: { en: 'Create Audiobook Review', uz: 'Audio kitob sharhini yaratish', ru: 'Создать рецензию аудиокниги' }
      },
      {
        action: PermissionsEnum.READ_AUDIOBOOK_REVIEW,
        name: { en: 'Read Audiobook Review', uz: 'Audio kitob sharhini ko\'rish', ru: 'Просмотр рецензии аудиокниги' }
      },
      {
        action: PermissionsEnum.UPDATE_AUDIOBOOK_REVIEW,
        name: { en: 'Update Audiobook Review', uz: 'Audio kitob sharhini tahrirlash', ru: 'Обновить рецензию аудиокниги' }
      },
      {
        action: PermissionsEnum.DELETE_AUDIOBOOK_REVIEW,
        name: { en: 'Delete Audiobook Review', uz: 'Audio kitob sharhini o\'chirish', ru: 'Удалить рецензию аудиокниги' }
      },
      {
        action: PermissionsEnum.MODERATE_AUDIOBOOK_REVIEW,
        name: { en: 'Moderate Audiobook Review', uz: 'Audio kitob sharhini moderatsiya qilish', ru: 'Модерировать рецензию аудиокниги' }
      },

      // Help Management Permissions
      {
        action: PermissionsEnum.CREATE_HELP,
        name: { en: 'Create Help', uz: 'Yordam yaratish', ru: 'Создать справку' }
      },
      {
        action: PermissionsEnum.READ_HELP,
        name: { en: 'Read Help', uz: 'Yordamni ko\'rish', ru: 'Просмотр справки' }
      },
      {
        action: PermissionsEnum.UPDATE_HELP,
        name: { en: 'Update Help', uz: 'Yordamni tahrirlash', ru: 'Обновить справку' }
      },
      {
        action: PermissionsEnum.DELETE_HELP,
        name: { en: 'Delete Help', uz: 'Yordamni o\'chirish', ru: 'Удалить справку' }
      },

      // Dashboard and Analytics Permissions
      {
        action: PermissionsEnum.READ_DASHBOARD,
        name: { en: 'Read Dashboard', uz: 'Boshqaruv panelini ko\'rish', ru: 'Просмотр панели управления' }
      },
      {
        action: PermissionsEnum.READ_ANALYTICS,
        name: { en: 'Read Analytics', uz: 'Analitikani ko\'rish', ru: 'Просмотр аналитики' }
      },
      {
        action: PermissionsEnum.READ_STATISTICS,
        name: { en: 'Read Statistics', uz: 'Statistikani ko\'rish', ru: 'Просмотр статистики' }
      },

      // System Administration Permissions
      {
        action: PermissionsEnum.MANAGE_SYSTEM,
        name: { en: 'Manage System', uz: 'Tizimni boshqarish', ru: 'Управление системой' }
      },
      {
        action: PermissionsEnum.READ_LOGS,
        name: { en: 'Read Logs', uz: 'Jurnallarni ko\'rish', ru: 'Просмотр логов' }
      },
      {
        action: PermissionsEnum.BACKUP_SYSTEM,
        name: { en: 'Backup System', uz: 'Tizimni zaxiralash', ru: 'Резервное копирование системы' }
      },
      {
        action: PermissionsEnum.RESTORE_SYSTEM,
        name: { en: 'Restore System', uz: 'Tizimni tiklash', ru: 'Восстановление системы' }
      },

      // Content Moderation Permissions
      {
        action: PermissionsEnum.MODERATE_CONTENT,
        name: { en: 'Moderate Content', uz: 'Kontentni moderatsiya qilish', ru: 'Модерировать контент' }
      },
      {
        action: PermissionsEnum.APPROVE_CONTENT,
        name: { en: 'Approve Content', uz: 'Kontentni tasdiqlash', ru: 'Утвердить контент' }
      },
      {
        action: PermissionsEnum.REJECT_CONTENT,
        name: { en: 'Reject Content', uz: 'Kontentni rad etish', ru: 'Отклонить контент' }
      },

      // Reporting Permissions
      {
        action: PermissionsEnum.READ_REPORTS,
        name: { en: 'Read Reports', uz: 'Hisobotlarni ko\'rish', ru: 'Просмотр отчетов' }
      },
      {
        action: PermissionsEnum.GENERATE_REPORTS,
        name: { en: 'Generate Reports', uz: 'Hisobotlar yaratish', ru: 'Генерировать отчеты' }
      },
      {
        action: PermissionsEnum.EXPORT_DATA,
        name: { en: 'Export Data', uz: 'Ma\'lumotlarni eksport qilish', ru: 'Экспорт данных' }
      }
    ];

    console.log(`🚀 Starting to seed ${permissionsData.length} permissions...`);

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Insert or update permissions
    for (const permissionData of permissionsData) {
      try {
        const existingPermission = await permissionRepository.findOne({
          where: { action: permissionData.action }
        });

        if (existingPermission) {
          // Update existing permission with new translations
          existingPermission.name = permissionData.name;
          await permissionRepository.save(existingPermission);
          updatedCount++;
        } else {
          // Create new permission
          const newPermission = permissionRepository.create({
            action: permissionData.action,
            name: permissionData.name
          });
          await permissionRepository.save(newPermission);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Error seeding permission ${permissionData.action}:`, error.message);
        skippedCount++;
      }
    }

    console.log('✅ Permissions seeding completed:');
    console.log(`   📝 Created: ${createdCount} permissions`);
    console.log(`   🔄 Updated: ${updatedCount} permissions`);
    console.log(`   ⏭️  Skipped: ${skippedCount} permissions`);
    console.log(`   📊 Total: ${createdCount + updatedCount} permissions processed`);
  }
}   