import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';

const collectionName = 'technologies';

class AdminFirebaseTechnologyRepositoryImp
    implements AdminTechnologyRepository {
  static final _firestore = FirebaseFirestore.instance;
  static final _storage = FirebaseStorage.instance;
  static final _collection = _firestore.collection(collectionName);
  @override
  Stream<List<Technology>> getTechnologies() {
    return _collection
        .withConverter<Technology>(
          fromFirestore: (snapshot, _) =>
              Technology.fromJson(snapshot.data()!).copyWith(id: snapshot.id),
          toFirestore: (product, _) => product.toJson(),
        )
        .snapshots()
        .map((snapshot) => snapshot.docs.map((e) => e.data()).toList());
  }

  @override
  Future<void> createTechnology(Technology technology) async {
    try {
      final imgRoute = '${technology.name}-${technology.id}/image.webp';
      final imageReference =
          _storage.ref().child(collectionName).child(imgRoute);

      await Future.wait([
        imageReference.putData(
          Uint8List.fromList(technology.imageUrl.codeUnits),
        ),
      ]);
      final imageUrl = await imageReference.getDownloadURL();

      await _collection.doc(technology.id).set(
            technology
                .copyWith(
                  imageUrl: imageUrl,
                  refImage: imageReference.fullPath,
                )
                .toJson(),
          );
    } catch (e) {
      // TODO(me): handle error
      FirebaseException(plugin: 'Firebase', message: e.toString());
    }
  }

  @override
  Future<void> updateTechnology(Technology technology) async {
    try {
      final isNewImage = !technology.isImageUrl;

      if (isNewImage && technology.imageUrl.isNotEmpty) {
        if (technology.hasRefImage) {
          await _storage.ref().child(technology.refImage!).delete();
        }

        final imgRoute = '${technology.name}-${technology.id}/image.webp';
        final imageReference =
            _storage.ref().child(collectionName).child(imgRoute);

        await imageReference
            .putData(Uint8List.fromList(technology.imageUrl.codeUnits));
        final imageUrl = await imageReference.getDownloadURL();

        await _collection.doc(technology.id).update(
              technology
                  .copyWith(
                    imageUrl: imageUrl,
                    refImage: imageReference.fullPath,
                  )
                  .toJson(),
            );
      } else {
        await _collection.doc(technology.id).update(technology.toJson());
      }
    } catch (e) {
      // TODO(me): handle error
      FirebaseException(plugin: 'Firebase', message: e.toString());
    }
  }

  @override
  Future<void> deleteTechnology(Technology technology) async {
    try {
      if (technology.refImage != null) {
        await _storage.ref().child(technology.refImage!).delete();
      }
      await _collection.doc(technology.id).delete();
    } catch (e) {
      // TODO(me): handle error
      FirebaseException(plugin: 'Firebase', message: e.toString());
    }
  }
}
