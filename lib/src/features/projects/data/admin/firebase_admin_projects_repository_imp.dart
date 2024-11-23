import 'package:portfolio/src/features/projects/data/services/firestore_service.dart';
import 'package:portfolio/src/features/projects/data/services/storage_service.dart';
import 'package:portfolio/src/features/projects/domain/admin_projects_repository.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/screenshot_image.dart';

class FirebaseAdminProjectsRepositoryImp implements AdminProjectsRepository {
  FirebaseAdminProjectsRepositoryImp({
    required this.storageService,
    required this.firestoreService,
    required this.collectionName,
  });

  final StorageService storageService;
  final FirestoreService<Project> firestoreService;
  final String collectionName;

  @override
  Stream<List<Project>> getProjectsStream() {
    return firestoreService.getCollectionStream(
      collectionName,
      fromJson: Project.fromJson,
    );
  }

  String _generateMainImageRef(String projectId) {
    return '$collectionName/$projectId/main-image.webp';
  }

  String _generateScreenshotRef(String projectId, int index) {
    return '$collectionName/$projectId/screenshots/$index-image.webp';
  }

  @override
  Future<void> createProject(Project project) async {
    var newProject = project;
    if (project.mainImage.hasLocalImage) {
      final imgRef = _generateMainImageRef(project.id);
      final mainImage = ImageAndPath(
        url: await storageService.uploadImage(
          project.mainImage.localImageCharCode!,
          imgRef,
        ),
        refPath: imgRef,
      );
      newProject = newProject.copyWith(mainImage: mainImage);
    }

    final screenshots = await Future.wait([
      ...List.generate(project.localScreenshots.length, (index) async {
        final screnshotPath = _generateScreenshotRef(project.id, index);
        return ImageAndPath(
          url: await storageService.uploadImage(
            project.localScreenshots[index].localImageCharCode!,
            screnshotPath,
          ),
          refPath: screnshotPath,
        );
      }),
    ]);

    // Crear documento en Firestore
    newProject = newProject.copyWith(
      screenshots: screenshots,
    );

    await firestoreService.createDocument(
      collectionPath: collectionName,
      documentId: project.id,
      data: newProject.toJson(),
    );
  }

  @override
  Future<void> updateProject(Project project) async {
    final projectId = project.id;
    var updatedProject = project;
    if (project.mainImage.needsToUpdate) {
      await storageService.deleteImage(project.mainImage.refPath!);

      final mainImageRef = _generateMainImageRef(projectId);
      final newMainImage = ImageAndPath(
        url: await storageService.uploadImage(
          project.mainImage.localImageCharCode!,
          mainImageRef,
        ),
        refPath: mainImageRef,
      );
      updatedProject = updatedProject.copyWith(mainImage: newMainImage);
    }

    final updatedScreenshots = await Future.wait([
      ...List.generate(project.screenshots.length, (index) async {
        var screenshot = project.screenshots[index];
        if (screenshot.needsToDelete || screenshot.needsToUpdate) {
          await storageService.deleteImage(screenshot.refPath!);
        }
        if (screenshot.hasLocalImage) {
          final screenshotRef = _generateScreenshotRef(projectId, index);
          screenshot = ImageAndPath(
            url: await storageService.uploadImage(
              screenshot.localImageCharCode!,
              screenshotRef,
            ),
            refPath: screenshotRef,
          );
        }
        return screenshot;
      }),
    ]);
    updatedProject = updatedProject.copyWith(
      screenshots: updatedScreenshots.where((ss) => ss.hasUrl).toList(),
    );

    await firestoreService.updateDocument(
      collectionPath: collectionName,
      documentId: projectId,
      data: updatedProject.toJson(),
    );
  }

  @override
  Future<void> deleteProject(Project project) async {
    await Future.wait([
      ...List.generate(project.refScreenshots.length, (index) {
        final screnshotPath = project.refScreenshots[index].refPath;
        return storageService.deleteImage(screnshotPath!);
      }),
    ]);
    if (project.mainImage.hasRefImage) {
      await storageService.deleteImage(project.mainImage.refPath!);
    }
    await firestoreService.deleteDocument(
      collectionPath: collectionName,
      documentId: project.id,
    );
  }
}
