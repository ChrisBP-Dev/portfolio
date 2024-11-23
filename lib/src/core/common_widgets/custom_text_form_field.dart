// lib/src/common_widgets/custom_text_form_field.dart
import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class CustomTextFormField extends StatelessWidget {
  const CustomTextFormField({
    required this.labelText,
    this.initialValue,
    this.controller,
    this.validator,
    this.onFieldSubmitted,
    this.keyboardType,
    super.key,
    this.onSaved,
    this.maxLines,
  }) : assert(
          initialValue == null || controller == null,
          'initialValue and controller cannot be used at the same time',
        );

  final String labelText;
  final String? initialValue;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final int? maxLines;
  final FormFieldSetter<String>? onSaved;
  final String? Function(String?)? validator;
  final void Function(String)? onFieldSubmitted;

  @override
  Widget build(BuildContext context) {
    final theme = context.theme;

    return TextFormField(
      initialValue: initialValue,
      controller: controller,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      cursorErrorColor: theme.dividerColor,
      textCapitalization: TextCapitalization.sentences,
      decoration: InputDecoration(
        filled: true,
        fillColor: theme.appBarTheme.backgroundColor?.withOpacity(.3),
        labelText: labelText,
        labelStyle: theme.textTheme.bodySmall
            ?.copyWith(color: context.getPrimaryColor().withOpacity(.8)),
        border: defaultBorder(context.getPrimaryColor()),
        enabledBorder: defaultBorder(context.getPrimaryColor()),
        focusedErrorBorder: defaultBorder(context.getPrimaryColor()),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: context.getPrimaryColor()),
        ),
      ),
      onFieldSubmitted: onFieldSubmitted,
      onSaved: onSaved,
      validator: validator,
      keyboardType: keyboardType,
      maxLines: maxLines,
      textAlignVertical: TextAlignVertical.top,
    );
  }

  OutlineInputBorder defaultBorder(Color color) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: color),
    );
  }
}
