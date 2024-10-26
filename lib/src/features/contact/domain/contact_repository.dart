import 'package:portfolio/src/features/contact/data/contact_repository_imp.dart';
import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'contact_repository.g.dart';

abstract class ContactRepository {
  Future<void> sendContactMessage(ContactMessage contactMessage);
}

@riverpod
ContactRepository contactRepository(ContactRepositoryRef ref) {
  return ContactRepositoryImp(ref);
}
