import 'package:flutter/foundation.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'admin_create_technology_form_controller.g.dart';

@riverpod
class AdminCreateTechnologyFormController
    extends _$AdminCreateTechnologyFormController {
  @override
  Technology build() {
    return const Technology(name: '', imageUrl: '');
  }

  void setName(String name) {
    state = state.copyWith(name: name);
  }

  void setExperienceTime(String experienceTime) {
    state = state.copyWith(experienceTime: experienceTime);
  }

  void setImageUrl(Uint8List imageUrl) {
    state = state.copyWith(
      imageUrl: imageUrl.map(String.fromCharCode).join(),
    );
  }

  void removeImageUrl() {
    state = state.copyWith(imageUrl: '');
  }
}
