import 'package:portfolio/src/core/constants/technologies.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/features/technologies/domain/technology_repository.dart';

class FakeTechnologyRepositoryImp implements TechnologyRepository {
  final _technologies = kTechnologies;

  @override
  Stream<List<Technology>> getAllTechnologies() {
    return Stream.value(_technologies);
  }
}
