import 'package:portfolio/src/features/experience/data/fake_experience_repository_imp.dart';
// import 'package:portfolio/src/features/experience/data/firebase_experience_repository_imp.dart';
import 'package:portfolio/src/features/experience/domain/experience.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'experience_repository.g.dart';

abstract class ExperienceRepository {
  Stream<List<Experience>> getExperiencesStream();
  Future<void> createExperience(Experience experience);
  Future<void> deleteExperience(Experience experience);
  Future<void> updateExperience(Experience experience);
}

@riverpod
ExperienceRepository experienceRepository(ExperienceRepositoryRef ref) {
  return FakeExperienceRepositoryImp();
  // return FirebaseExperienceRepositoryImp();
}

@Riverpod(keepAlive: true)
Stream<List<Experience>> getExperiencesStream(GetExperiencesStreamRef ref) {
  return ref.read(experienceRepositoryProvider).getExperiencesStream();
}
