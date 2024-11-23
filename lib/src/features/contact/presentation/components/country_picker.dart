import 'package:country_code_picker/country_code_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/features/contact/presentation/contact_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';

class CountryPicker extends ConsumerWidget {
  const CountryPicker({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final contactMessage = ref.watch(contactControllerProvider);
    final l10n = context.l10n;
    return Theme(
      data: context.theme.copyWith(
        textButtonTheme: TextButtonThemeData(
          style: ButtonStyle(
            shape: WidgetStateProperty.all(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(Sizes.p8),
              ),
            ),
            side: WidgetStateProperty.all(
              BorderSide(
                color: context.theme.dividerColor,
              ),
            ),
          ),
        ),
      ),
      child: CountryCodePicker(
        dialogSize: const Size(
          Breakpoint.mobile / 2,
          Breakpoint.mobile * .85,
        ),
        onChanged: (countryCode) {
          ref.read(contactControllerProvider.notifier).updatePhoneNumber(
                countryCode.dialCode ?? '+1',
                contactMessage.phoneNumber.number,
              );
        },
        initialSelection: 'US',
        favorite: const ['+1', 'US'],
        textStyle: context.bodyLarge?.copyWith(
          color: context.theme.colorScheme.onSurface,
        ),
        searchDecoration: InputDecoration(
          hintText: l10n.searchCountryHint,
          hintStyle: context.bodyMedium?.copyWith(
            color: context.theme.hintColor,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        dialogBackgroundColor: context.theme.scaffoldBackgroundColor,
        dialogTextStyle: context.bodyLarge?.copyWith(
          color: context.theme.colorScheme.onSurface,
        ),
        barrierColor: Colors.black.withOpacity(0.5),
        boxDecoration: BoxDecoration(
          color: context.theme.scaffoldBackgroundColor,
          borderRadius: BorderRadius.circular(Sizes.p8),
        ),
        showFlagDialog: true,
        showFlagMain: true,
        closeIcon: Icon(
          Icons.close,
          color: context.theme.colorScheme.onSurface,
        ),
      ),
    );
  }
}
