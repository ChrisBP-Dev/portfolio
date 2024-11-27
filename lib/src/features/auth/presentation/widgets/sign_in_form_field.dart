import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/custom_text_form_field.dart';
import 'package:portfolio/src/localization/l10n.dart';

class SignInFormField extends StatelessWidget {
  const SignInFormField({
    required this.formType,
    super.key,
    this.maxLines,
    this.controller,
  });

  final int? maxLines;
  final TextEditingController? controller;
  final SignInFormType formType;

  @override
  Widget build(BuildContext context) {
    return CustomTextFormField(
      controller: controller,
      labelText: formType.getLabelText(context),
      validator: (value) {
        if (value != null && value.isNotEmpty) return null;
        return formType.getErrorText(context);
      },
      keyboardType: formType.getKeyboardType(),
      maxLines: maxLines,
    );
  }
}

enum SignInFormType {
  email,
  password,
}

extension SignInFormFieldTypeX on SignInFormType {
  String getLabelText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      SignInFormType.email => l10n.emailLabel,
      SignInFormType.password => l10n.password,
    };
  }

  String getErrorText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      SignInFormType.email => l10n.errorMessage(l10n.emailLabel),
      SignInFormType.password => l10n.errorMessage(l10n.password),
    };
  }

  TextInputType getKeyboardType() {
    return switch (this) {
      SignInFormType.email => TextInputType.emailAddress,
      SignInFormType.password => TextInputType.visiblePassword,
    };
  }
}
