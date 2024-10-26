import 'package:portfolio/src/core/constants/knowledge.dart';
import 'package:portfolio/src/features/knowledge/domain/knowledge.dart';
import 'package:portfolio/src/features/knowledge/domain/knowledge_repository.dart';

class FakeKnowledgeRepositoryImp implements KnowledgeRepository {
  final Knowledge _knowledges = kKnowledge;
  @override
  Future<Knowledge> getKnowledge() {
    return Future.value(_knowledges);
  }

  @override
  Future<void> createKnowledge(Knowledge knowledge) {
    throw UnimplementedError();
  }

  @override
  Future<void> deleteKnowledge(Knowledge knowledge) {
    throw UnimplementedError();
  }

  @override
  Future<void> updateKnowledge(Knowledge knowledge) {
    throw UnimplementedError();
  }
}
