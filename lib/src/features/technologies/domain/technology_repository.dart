import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/technologies/data/firebase_technology_repository_imp.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'technology_repository.g.dart';

abstract class TechnologyRepository {
  Stream<List<Technology>> getAllTechnologies();
}

@riverpod
TechnologyRepository technologyRepository(Ref ref) {
  return FirebaseTechnologyRepositoryImp();
}

@Riverpod(keepAlive: true)
Stream<List<Technology>> getTechnologies(Ref ref) {
  return ref.read(technologyRepositoryProvider).getAllTechnologies();
}

@Riverpod(keepAlive: true)
Stream<List<Technology>> getTechnologiesById(Ref ref, List<TechnologyID> ids) {
  return ref.read(technologyRepositoryProvider).getAllTechnologies().map(
        (technologies) => technologies
            .where((technology) => ids.contains(technology.id))
            .toList(),
      );
}
