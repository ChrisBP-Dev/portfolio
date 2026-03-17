import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:portfolio/src/features/contact/domain/contact_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'contact_controller.g.dart';

@riverpod
class ContactController extends _$ContactController {
  @override
  Future<void> build() async {
    // nothing to do here
  }

  Future<void> sendContactMessage(ContactMessage contactMessage) async {
    state = const AsyncValue.loading();
    final repository = ref.read(contactRepositoryProvider);
    state = await AsyncValue.guard(
      () => repository.sendContactMessage(contactMessage),
    );
  }
}
