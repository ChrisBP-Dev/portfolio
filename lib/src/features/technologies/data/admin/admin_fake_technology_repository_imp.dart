import 'package:portfolio/src/core/constants/technologies.dart';
import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';

class AdminFakeTechnologyRepositoryImp implements AdminTechnologyRepository {
  final _technologies = kTechnologies;
  @override
  Stream<List<Technology>> getTechnologies() {
    return Stream.value(_technologies);
  }

  @override
  Future<void> createTechnology(Technology technology) async {}

  @override
  Future<void> deleteTechnology(Technology technology) async {}

  @override
  Future<void> updateTechnology(Technology technology) async {}
}
