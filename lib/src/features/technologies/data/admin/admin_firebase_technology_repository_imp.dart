import 'package:portfolio/src/features/projects/data/services/firestore_service.dart';
import 'package:portfolio/src/features/projects/data/services/storage_service.dart';
import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';

const _collectionName = 'technologies';

class AdminFirebaseTechnologyRepositoryImp
    implements AdminTechnologyRepository {
  const AdminFirebaseTechnologyRepositoryImp({
    required this.storageService,
    required this.firestoreService,
  });

  final StorageService storageService;
  final FirestoreService<Technology> firestoreService;

  @override
  Stream<List<Technology>> getAllTechnologies() {
    return firestoreService.getCollectionStream(
      _collectionName,
      fromJson: Technology.fromJson,
    );
  }

  @override
  Future<void> createTechnology(Technology technology) async {
    final imgRef =
        '$_collectionName${technology.name}-${technology.id}/image.webp';
    final imageUrl = await storageService.uploadImage(
      technology.imageCharCode,
      imgRef,
    );

    await firestoreService.addDocument(
      documentId: technology.id,
      collectionPath: _collectionName,
      data: technology.copyWith(imageUrl: imageUrl, refImage: imgRef).toJson(),
    );
  }

  @override
  Future<void> updateTechnology(Technology technology) async {
    final isNewImage = !technology.isImageUrl;

    if (isNewImage && technology.imageUrl.isNotEmpty) {
      if (technology.hasRefImage) {
        await storageService.deleteImage(technology.refImage!);
      }

      final refImg =
          '$_collectionName/${technology.name}-${technology.id}/image.webp';
      final imageUrl = await storageService.uploadImage(
        technology.imageCharCode,
        refImg,
      );

      await firestoreService.updateDocument(
        collectionPath: _collectionName,
        documentId: technology.id,
        data: technology
            .copyWith(
              imageUrl: imageUrl,
              refImage: refImg,
            )
            .toJson(),
      );
    } else {
      await firestoreService.updateDocument(
        collectionPath: _collectionName,
        documentId: technology.id,
        data: technology.toJson(),
      );
    }
  }

  @override
  Future<void> deleteTechnology(Technology technology) async {
    if (technology.refImage != null) {
      await storageService.deleteImage(technology.refImage!);
    }
    await firestoreService.deleteDocument(
      collectionPath: _collectionName,
      documentId: technology.id,
    );
  }
}
