import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/features/technologies/domain/technology_repository.dart';

class FirebaseTechnologyRepositoryImp implements TechnologyRepository {
  static final _firestore = FirebaseFirestore.instance;
  static final _collection = _firestore.collection('technologies');

  @override
  Stream<List<Technology>> getAllTechnologies() {
    return _collection
        .withConverter<Technology>(
          fromFirestore: (snapshot, _) =>
              Technology.fromJson(snapshot.data()!).copyWith(id: snapshot.id),
          toFirestore: (product, _) => product.toJson(),
        )
        .snapshots()
        .map((snapshot) => snapshot.docs.map((e) => e.data()).toList());
  }
}
