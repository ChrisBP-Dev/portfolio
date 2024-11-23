import 'package:portfolio/src/core/constants/experiences.dart';
import 'package:portfolio/src/features/experience/domain/experience.dart';
import 'package:portfolio/src/features/experience/domain/experience_repository.dart';

class FakeExperienceRepositoryImp implements ExperienceRepository {
  final List<Experience> _experiences = kExperiences;

  @override
  Stream<List<Experience>> getExperiencesStream() {
    return Stream.value(_experiences);
  }

  @override
  Future<void> createExperience(Experience experience) async {
    _experiences.add(experience);
  }

  @override
  Future<void> deleteExperience(Experience experience) async {
    _experiences.removeWhere((e) => e.id == experience.id);
  }

  @override
  Future<void> updateExperience(Experience experience) async {
    final index = _experiences.indexWhere((e) => e.id == experience.id);
    if (index != -1) {
      _experiences[index] = experience;
    }
  }
}
