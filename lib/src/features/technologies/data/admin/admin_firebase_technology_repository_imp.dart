import 'package:portfolio/src/features/projects/data/services/firestore_service.dart';
import 'package:portfolio/src/features/projects/data/services/storage_service.dart';
import 'package:portfolio/src/features/projects/domain/screenshot_image.dart';
import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';

class AdminFirebaseTechnologyRepositoryImp
    implements AdminTechnologyRepository {
  const AdminFirebaseTechnologyRepositoryImp({
    required this.storageService,
    required this.firestoreService,
    required this.collectionName,
  });

  final StorageService storageService;
  final FirestoreService<Technology> firestoreService;
  final String collectionName;

  @override
  Stream<List<Technology>> getAllTechnologies() {
    return firestoreService.getCollectionStream(
      collectionName,
      fromJson: Technology.fromJson,
    );
  }

  String _generateImageRef(String technologyId) {
    return '$collectionName/$technologyId/image.webp';
  }

  @override
  Future<void> createTechnology(Technology technology) async {
    var newTechnology = technology;
    if (technology.image.hasLocalImage) {
      final imgRef = _generateImageRef(technology.id);
      final newImage = ImageAndPath(
        url: await storageService.uploadImage(
          technology.image.localImageCharCode!,
          imgRef,
        ),
        refPath: imgRef,
      );
      newTechnology = newTechnology.copyWith(image: newImage);
    }

    await firestoreService.createDocument(
      documentId: technology.id,
      collectionPath: collectionName,
      data: newTechnology.toJson(),
    );
  }

  @override
  Future<void> updateTechnology(Technology technology) async {
    var updatedTechnology = technology;
    if (technology.image.needsToUpdate) {
      if (technology.image.hasRefImage) {
        await storageService.deleteImage(technology.image.refPath!);
      }

      final refImg = _generateImageRef(technology.id);
      final newImage = ImageAndPath(
        url: await storageService.uploadImage(
          technology.image.localImageCharCode!,
          refImg,
        ),
        refPath: refImg,
      );

      updatedTechnology = updatedTechnology.copyWith(image: newImage);
    }
    await firestoreService.updateDocument(
      collectionPath: collectionName,
      documentId: updatedTechnology.id,
      data: updatedTechnology.toJson(),
    );
  }

  @override
  Future<void> deleteTechnology(Technology technology) async {
    if (technology.image.hasRefImage) {
      await storageService.deleteImage(technology.image.refPath!);
    }
    await firestoreService.deleteDocument(
      collectionPath: collectionName,
      documentId: technology.id,
    );
  }
}
