import 'package:portfolio/src/features/knowledge/data/fake_knowledge_repository_imp.dart';
import 'package:portfolio/src/features/knowledge/domain/knowledge.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'knowledge_repository.g.dart';

abstract class KnowledgeRepository {
  Future<Knowledge> getKnowledge();
  Future<void> createKnowledge(Knowledge knowledge);
  Future<void> deleteKnowledge(Knowledge knowledge);
  Future<void> updateKnowledge(Knowledge knowledge);
}

@riverpod
KnowledgeRepository knowledgeRepository(KnowledgeRepositoryRef ref) {
  return FakeKnowledgeRepositoryImp();
}

@riverpod
Future<Knowledge> getKnowledge(GetKnowledgeRef ref) {
  return ref.read(knowledgeRepositoryProvider).getKnowledge();
}
