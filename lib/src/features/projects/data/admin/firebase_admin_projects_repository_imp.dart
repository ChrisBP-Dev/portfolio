import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:portfolio/src/features/projects/domain/admin_projects_repository.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:uuid/uuid.dart';

const _collectionName = 'Projects';

class FirebaseAdminProjectsRepositoryImp implements AdminProjectsRepository {
  static final _firestore = FirebaseFirestore.instance;
  static final _storage = FirebaseStorage.instance;
  static final _collection = _firestore.collection(_collectionName);

  @override
  Stream<List<Project>> getProjectsStream() {
    return _collection.snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        return Project.fromJson(doc.data()).copyWith(id: doc.id);
      }).toList();
    });
  }

  @override
  Future<void> createProject(Project project) async {
    try {
      final id = const Uuid().v4();
      final imgRoute = '${project.companyNameEn}-$id';
      final imageReference = _storage.ref().child(_collectionName);

      final mainImageReference =
          imageReference.child('$imgRoute/main-image.webp');
      final imagesReferences =
          List.generate(project.imagesUrls.length, (index) {
        return imageReference.child('$imgRoute/$index-image.webp');
      });
      await Future.wait([
        ...List.generate(project.imagesUrls.length, (index) {
          return imagesReferences[index].putData(
            Uint8List.fromList(project.imagesUrls[index].codeUnits),
          );
        }),
        mainImageReference.putData(
          Uint8List.fromList(project.mainImageUrl.codeUnits),
        ),
      ]);
      final mainUrl = await mainImageReference.getDownloadURL();
      final imagesUrls = await Future.wait(
        List.generate(imagesReferences.length, (index) {
          return imagesReferences[index].getDownloadURL();
        }),
      );

      await _collection.add(
        project
            .copyWith(
              id: id,
              mainImageUrl: mainUrl,
              refMainImage: mainImageReference.fullPath,
              imagesUrls: imagesUrls,
              refImagesUrls:
                  imagesReferences.map((ref) => ref.fullPath).toList(),
            )
            .toJson(),
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> deleteProject(Project project) async {
    try {
      await Future.wait([
        ...List.generate(project.refImagesUrls.length, (index) {
          return _storage.ref(project.refImagesUrls[index]).delete();
        }),
        _storage.ref(project.refMainImage).delete(),
      ]);
      await _collection.doc(project.id).delete();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Project> updateProject(Project project) async {
    // TODO(me): Implement updateProject
    await _collection.doc(project.id).update(project.toJson());
    return project;
  }
}
