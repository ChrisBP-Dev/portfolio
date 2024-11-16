import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/projects/data/services/firestore_service.dart';
import 'package:portfolio/src/features/projects/data/services/storage_service.dart';
import 'package:portfolio/src/features/technologies/data/admin/admin_firebase_technology_repository_imp.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/features/technologies/domain/technology_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'admin_technology_repository.g.dart';

abstract class AdminTechnologyRepository extends TechnologyRepository {
  Future<void> createTechnology(Technology technology);
  Future<void> updateTechnology(Technology technology);
  Future<void> deleteTechnology(Technology technology);
}

@riverpod
FirestoreService<Technology> firestoreServiceTechnology(Ref ref) {
  return FirestoreService<Technology>(ref.read(firebaseFirestoreProvider));
}

@riverpod
AdminTechnologyRepository adminTechnologyRepository(Ref ref) {
  // return AdminFakeTechnologyRepositoryImp();
  return AdminFirebaseTechnologyRepositoryImp(
    storageService: ref.read(storageServiceProvider),
    firestoreService: ref.read(firestoreServiceTechnologyProvider),
  );
}

@Riverpod(keepAlive: true)
Stream<List<Technology>> getAdminTechnologies(Ref ref) {
  return ref.read(adminTechnologyRepositoryProvider).getAllTechnologies();
}
