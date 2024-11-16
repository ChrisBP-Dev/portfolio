import 'package:flutter/foundation.dart';
import 'package:portfolio/src/features/projects/data/services/firestore_service.dart';
import 'package:portfolio/src/features/projects/data/services/storage_service.dart';
import 'package:portfolio/src/features/projects/domain/admin_projects_repository.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';

const _collectionName = 'Projects'; // TODO(me): change to 'projects'

class FirebaseAdminProjectsRepositoryImp implements AdminProjectsRepository {
  FirebaseAdminProjectsRepositoryImp({
    required this.storageService,
    required this.firestoreService,
  });

  final StorageService storageService;
  final FirestoreService<Project> firestoreService;

  @override
  Stream<List<Project>> getProjectsStream() {
    return firestoreService.getCollectionStream(
      _collectionName,
      fromJson: Project.fromJson,
    );
  }

  @override
  Future<void> createProject(Project project) async {
    final time = DateTime.now().millisecondsSinceEpoch;
    final imgRoute = '$_collectionName/${project.id}';
    final mainImageRef = '$imgRoute/main-image-$time.webp';
    final mainImageUrl = await storageService.uploadImage(
      project.mainImageCharCode,
      mainImageRef,
    );

    final screenshotsRef = List.generate(
      project.screenshotsUrls.length,
      (index) {
        return '$imgRoute/$index-image-$time.webp';
      },
    );

    final screenshotUrls = await Future.wait([
      ...List.generate(project.screenshotsUrls.length, (index) async {
        return storageService.uploadImage(
          project.screenshotsCharCodes[index],
          screenshotsRef[index],
        );
      }),
    ]);

    await firestoreService.addDocument(
      collectionPath: _collectionName,
      documentId: project.id,
      data: project
          .copyWith(
            mainImageUrl: mainImageUrl,
            refMainImage: mainImageRef,
            screenshotsUrls: screenshotUrls,
            refScreenshotsUrls: screenshotsRef,
          )
          .toJson(),
    );
  }

  @override
  Future<void> deleteProject(Project project) async {
    await Future.wait([
      ...List.generate(project.refScreenshotsUrls.length, (index) {
        return storageService.deleteImage(project.refScreenshotsUrls[index]);
      }),
      if (project.refMainImage != null)
        storageService.deleteImage(project.refMainImage!),
    ]);
    await firestoreService.deleteDocument(
      collectionPath: _collectionName,
      documentId: project.id,
    );
  }

  @override
  Future<void> updateProject(Project oldProject, Project newProject) async {
    try {
      final time = DateTime.now().millisecondsSinceEpoch;
      final imgRoute = '$_collectionName/${oldProject.id}';
      final mainImageRef = '$imgRoute/main-image-$time.webp';

      final screenshotsRef = List.generate(
        newProject.screenshotsUrls.length,
        (index) => '$imgRoute/$index-image-$time.webp',
      );

      String? mainImageUrl;
      if (!listEquals(
        newProject.mainImageCharCode,
        oldProject.mainImageCharCode,
      )) {
        // Eliminar imagen anterior si existe
        if (oldProject.refMainImage != null) {
          await storageService.deleteImage(oldProject.refMainImage!);
        }
        // Subir nueva imagen
        mainImageUrl = await storageService.uploadImage(
          newProject.mainImageCharCode,
          mainImageRef,
        );
      } else {
        // Mantener la URL antigua si no ha cambiado
        mainImageUrl = oldProject.mainImageUrl;
      }

      /// Manejo de capturas de pantalla
      final screenshotUrls = await _updateScreenshots(
        oldProject,
        newProject,
        screenshotsRef,
      );

      // Eliminar capturas de pantalla obsoletas
      await _deleteObsoleteScreenshots(
        oldProject,
        newProject.refScreenshotsUrls,
      );

      // Actualizar el documento en Firestore
      await firestoreService.updateDocument(
        collectionPath: _collectionName,
        documentId: newProject.id,
        data: newProject
            .copyWith(
              mainImageUrl: mainImageUrl,
              refMainImage: mainImageRef,
              screenshotsUrls: screenshotUrls,
              refScreenshotsUrls: screenshotsRef,
            )
            .toJson(),
      );
    } on StorageException catch (e, st) {
      Error.throwWithStackTrace(
        FirestoreException(
          'Error al actualizar imágenes en Storage: ${e.message}',
          FirestoreErrorType.updateError,
        ),
        st,
      );
    } on FirestoreException catch (e, st) {
      Error.throwWithStackTrace(
        FirestoreException(
          'Error al actualizar proyecto en Firestore: ${e.message}',
          FirestoreErrorType.updateError,
        ),
        st,
      );
    }
  }

  /// Método para actualizar capturas de pantalla
  Future<List<String>> _updateScreenshots(
    Project oldProject,
    Project newProject,
    List<String> screenshotsRef,
  ) async {
    final updatedScreenshotUrls = <String>[];

    for (var index = 0;
        index < newProject.screenshotsCharCodes.length;
        index++) {
      final newScreenshotCode = newProject.screenshotsCharCodes[index];

      // Verificar si la imagen cambió
      if (index < oldProject.screenshotsCharCodes.length &&
          listEquals(
            newScreenshotCode,
            oldProject.screenshotsCharCodes[index],
          )) {
        // Mantener la URL antigua si no ha cambiado
        updatedScreenshotUrls.add(oldProject.screenshotsUrls[index]);
      } else {
        // Eliminar la imagen antigua si se reemplaza
        if (index < oldProject.refScreenshotsUrls.length) {
          await storageService
              .deleteImage(oldProject.refScreenshotsUrls[index]);
        }
        // Subir nueva imagen
        final newScreenshotUrl = await storageService.uploadImage(
          newScreenshotCode,
          screenshotsRef[index],
        );
        updatedScreenshotUrls.add(newScreenshotUrl);
      }
    }

    return updatedScreenshotUrls;
  }

  /// Método para eliminar capturas de pantalla obsoletas
  Future<void> _deleteObsoleteScreenshots(
    Project oldProject,
    List<String> newScreenshotRefs,
  ) async {
    // Eliminar capturas de pantalla que ya no están referenciadas en el nuevo proyecto
    final obsoleteScreenshots = oldProject.refScreenshotsUrls.where((oldRef) {
      return !newScreenshotRefs.contains(oldRef);
    });

    await Future.wait(obsoleteScreenshots.map(storageService.deleteImage));
  }
}
