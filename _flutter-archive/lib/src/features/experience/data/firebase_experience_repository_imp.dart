import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:portfolio/src/features/experience/domain/experience.dart';
import 'package:portfolio/src/features/experience/domain/experience_repository.dart';

class FirebaseExperienceRepositoryImp implements ExperienceRepository {
  static final _firestore = FirebaseFirestore.instance;
  static final _collection = _firestore.collection('Experiences');
  @override
  Stream<List<Experience>> getExperiencesStream() {
    return _collection.snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        return Experience.fromJson(doc.data()).copyWith(id: doc.id);
      }).toList();
    });
  }

  @override
  Future<void> createExperience(Experience experience) {
    return _collection.add(experience.toJson());
  }

  @override
  Future<void> deleteExperience(Experience experience) {
    return _collection.doc(experience.id).delete();
  }

  @override
  Future<void> updateExperience(Experience experience) {
    return _collection.doc(experience.id).update(experience.toJson());
  }
}
