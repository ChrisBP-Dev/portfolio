import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/technologies/data/firebase_technology_repository_imp.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'technology_repository.g.dart';

abstract class TechnologyRepository {
  Stream<List<Technology>> getTechnologies();
}

@riverpod
TechnologyRepository technologyRepository(Ref ref) {
  return FirebaseTechnologyRepositoryImp();
}

@Riverpod(keepAlive: true)
Stream<List<Technology>> getTechnologies(Ref ref) {
  return ref.read(technologyRepositoryProvider).getTechnologies();
}
